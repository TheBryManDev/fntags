/**
 * A function to create dom elements with the given attributes and children.
 *
 * The first element of the children array can be an object containing element attributes.
 * The attribute names are the standard attribute names used in html, and should all be lower case as usual.
 *
 * Any attribute starting with 'on' that is a function is added as an event listener with the 'on' removed.
 * i.e. { onclick: fn } gets added to the element as element.addEventListener('click', fn)
 *
 * The style attribute can be an object and the properties of the object will be added as style properties to the element.
 * i.e. { style: { color: blue } } becomes element.style.color = blue
 *
 * The rest of the arguments will be considered children of this element and appended to it in the same order as passed.
 *
 * @param tag html tag to use when created the element
 * @param children optional attributes object and children for the element
 * @returns HTMLElement an html element
 *
 */
export function h (tag, ...children) {
  let firstChildIdx = 0
  let element
  const nsIndex = hasNs(tag)
  if (nsIndex > -1) {
    const { ns, val } = splitNs(tag, nsIndex)
    element = document.createElementNS(ns, val)
  } else {
    element = document.createElement(tag)
  }

  if (isAttrs(children[firstChildIdx])) {
    const attrs = children[firstChildIdx]
    firstChildIdx += 1
    let hasValue = false
    for (const a in attrs) {
      // set value last to ensure value constraints are set before trying to set the value to avoid modification
      // For example, when using a range and specifying a min and max
      //  if the value is set first and is outside the default 1 to 100 range
      //  the value will be adjusted to be within the range, even though the value attribute will be set correctly
      if (a === 'value') {
        hasValue = true
        continue
      }
      setAttribute(a, attrs[a], element)
    }
    if (hasValue) {
      setAttribute('value', attrs.value, element)
    }
  }
  for (let i = firstChildIdx; i < children.length; i++) {
    const child = children[i]
    if (Array.isArray(child)) {
      for (const c of child) {
        element.append(renderNode(c))
      }
    } else {
      element.append(renderNode(child))
    }
  }
  return element
}

function splitNs (val, i) {
  return { ns: val.slice(0, i), val: val.slice(i + 1) }
}

function hasNs (val) {
  return val.lastIndexOf(':')
}

/**
 * Create a compiled template function. The returned function takes a single object that contains the properties
 * defined in the template.
 *
 * This allows fast rendering by pre-creating a dom element with the entire template structure then cloning and populating
 * the clone with data from the provided context. This avoids the work of having to re-execute the tag functions
 * one by one and can speed up situations where a similar element is created many times.
 *
 * You cannot bind state to the initial template. If you attempt to, the state will be read, but the elements will
 * not be updated when the state changes because they will not be bound to the cloned element.
 * All state bindings must be passed in the context to the compiled template to work correctly.
 * @param templateFn {function(object): Node}
 * @return {function(*): Node}
 */
export const fntemplate = templateFn => {
  if (typeof templateFn !== 'function') {
    throw new Error('You must pass a function to fntemplate. The function must return an html node.')
  }
  const placeholders = {}
  let id = 1
  const initContext = prop => {
    if (!prop || typeof prop !== 'string') {
      throw new Error('You must pass a non empty string prop name to the context function.')
    }
    const placeholder = (element, type, attrOrStyle) => {
      let selector = element.__fnselector
      if (!selector) {
        selector = `fntpl-${id++}`
        element.__fnselector = selector
        element.classList.add(selector)
      }
      if (!placeholders[selector]) placeholders[selector] = []
      placeholders[selector].push({ prop, type, attrOrStyle })
    }
    placeholder.isTemplatePlaceholder = true
    return placeholder
  }
  // The initial render is cloned to prevent invalid state bindings from changing it
  const compiled = templateFn(initContext).cloneNode(true)
  return ctx => {
    const clone = compiled.cloneNode(true)
    for (const selectorClass in placeholders) {
      let targetElement = clone.getElementsByClassName(selectorClass)[0]
      if (!targetElement) {
        if (clone.classList.contains(selectorClass)) {
          targetElement = clone
        } else {
          throw new Error(`Cannot find template element for selectorClass ${selectorClass}`)
        }
      }
      targetElement.classList.remove(selectorClass)
      for (const placeholder of placeholders[selectorClass]) {
        switch (placeholder.type) {
          case 'node':
            targetElement.replaceWith(renderNode(ctx[placeholder.prop]))
            break
          case 'attr':
            setAttribute(placeholder.attrOrStyle, ctx[placeholder.prop], targetElement)
            break
          case 'style':
            setStyle(placeholder.attrOrStyle, ctx[placeholder.prop], targetElement)
            break
          default:
            throw new Error(`Unexpected bindType ${placeholder.type}`)
        }
      }
    }
    return clone
  }
}

/**
 * Create a state object that can be bound to.
 * @param initialValue The initial state
 * @param mapKey A map function to extract a key from an element in the array. Receives the array value to extract the key from.
 * @returns function A function that can be used to get and set the state.
 * When getting the state, you get the actual reference to the underlying value.
 * If you perform modifications to the value, be sure to call the state function with the updated value when you're done
 * or the changes won't be reflected correctly and binding updates won't be triggered even though the state appears to be correct.
 *
 */
export const fnstate = (initialValue, mapKey) => {
  const ctx = {
    currentValue: initialValue,
    observers: [],
    bindContexts: [],
    selectObservers: {},
    nextId: 0,
    mapKey,
    state (newState) {
      if (arguments.length === 0 || (arguments.length === 1 && arguments[0] === ctx.state)) {
        return ctx.currentValue
      } else {
        const oldState = ctx.currentValue
        ctx.currentValue = newState
        for (const observer of ctx.observers) {
          observer.fn(newState, oldState)
        }
      }
      return newState
    }
  }

  /**
   * Bind the values of this state to the given element.
   * Values are items/elements of an array.
   * If the current value is not an array, this will behave the same as bindAs.
   *
   * @param parent The parent to bind the children to.
   * @param element The element to bind to. If not a function, an update function must be passed
   * @param update If passed this will be executed directly when the state of any value changes with no other intervention
   */
  ctx.state.bindChildren = (parent, element, update) => doBindChildren(ctx, parent, element, update)

  /**
   * Bind this state to the given element
   *
   * @param [element] The element to bind to. If not a function, an update function must be passed. If not passed, defaults to the state's value
   * @param [update] If passed this will be executed directly when the state changes with no other intervention
   * @returns {(HTMLDivElement|Text)[]|HTMLDivElement|Text}
   */
  ctx.state.bindAs = (element, update) => doBindAs(ctx, element ?? ctx.state, update)

  /**
   * Bind a property of an object stored in this state as a simple value.
   *
   * Shortcut for `mystate.bindAs((current)=> current[prop])`
   *
   * @param {string} prop The object property to bind as
   * @returns {(HTMLDivElement|Text)[]|HTMLDivElement|Text}
   */
  ctx.state.bindProp = (prop) => doBindAs(ctx, (st) => st[prop])

  /**
   * Bind attribute values to state changes
   * @param [attribute] A function that returns an attribute value. If not passed, defaults to the state's value
   * @returns {function(): *} A function that calls the passed function, with some extra metadata
   */
  ctx.state.bindAttr = (attribute) => doBindAttr(ctx.state, attribute ?? ctx.state)

  /**
   * Bind style values to state changes
   * @param [style] A function that returns a style's value. If not passed, defaults to the state's value
   * @returns {function(): *} A function that calls the passed function, with some extra metadata
   */
  ctx.state.bindStyle = (style) => doBindStyle(ctx.state, style ?? ctx.state)

  /**
   * Bind select and deselect to an element
   * @param [element] The element to bind to. If not a function, an update function must be passed. If not passed, defaults to the state's value
   * @param update If passed this will be executed directly when the state changes with no other intervention
   */
  ctx.state.bindSelect = (element, update) => doBindSelect(ctx, element ?? ctx.state, update)

  /**
   * Bind select and deselect to an attribute
   * @param [attribute] A function that returns an attribute value. If not passed, defaults to the state's value
   * @returns {function(): *} A function that calls the passed function, with some extra metadata
   */
  ctx.state.bindSelectAttr = (attribute) => doBindSelectAttr(ctx, attribute ?? ctx.state)

  /**
   * Mark the element with the given key as selected. This causes the bound select functions to be executed.
   */
  ctx.state.select = (key) => doSelect(ctx, key)

  /**
   * Get the currently selected key
   * @returns {*}
   */
  ctx.state.selected = () => ctx.selected

  ctx.state.isFnState = true

  /**
   * Perform an Object.assign on the current state using the provided update
   */
  ctx.state.assign = (update) => ctx.state(Object.assign(ctx.currentValue, update))

  /**
   * Get a value at the given property path, an error is thrown if the value is not an object
   *
   * This returns a reference to the real current value. If you perform any modifications to the object, be sure to call setPath after you're done or the changes
   * will not be reflected correctly.
   */
  ctx.state.getPath = (path) => {
    if (typeof path !== 'string') {
      throw new Error('Invalid path')
    }
    if (typeof ctx.currentValue !== 'object') {
      throw new Error('Value is not an object')
    }
    return path
      .split('.')
      .reduce(
        (curr, part) => {
          if (part in curr) {
            return curr[part]
          } else {
            return undefined
          }
        },
        ctx.currentValue
      )
  }

  /**
   * Set a value at the given property path
   * @param path The JSON path of the value to set
   * @param value The value to set the path to
   * @param fillWithObjects Whether to non object values with new empty objects.
   */
  ctx.state.setPath = (path, value, fillWithObjects = false) => {
    const s = path.split('.')
    const parent = s
      .slice(0, -1)
      .reduce(
        (current, part) => {
          if (fillWithObjects && typeof current[part] !== 'object') {
            current[part] = {}
          }
          return current[part]
        },
        ctx.currentValue
      )

    if (parent && typeof parent === 'object') {
      parent[s.slice(-1)] = value
      ctx.state(ctx.currentValue)
    } else {
      throw new Error(`No object at path ${path}`)
    }
  }

  /**
   * Register a callback that will be executed whenever the state is changed
   * @return a function to stop the subscription
   */
  ctx.state.subscribe = (callback) => doSubscribe(ctx, ctx.observers, callback)

  /**
   * Remove all of the observers and optionally reset the value to it's initial value
   */
  ctx.state.reset = (reInit) => doReset(ctx, reInit, initialValue)

  return ctx.state
}

function doSubscribe (ctx, list, listener) {
  const id = ctx.nextId++
  list.push({ id, fn: listener })
  return () => {
    list.splice(list.findIndex(l => l.id === id), 1)
    list = null
  }
}

const subscribeSelect = (ctx, callback) => {
  const parentCtx = ctx.state.parentCtx
  const key = keyMapper(parentCtx.mapKey, ctx.currentValue)
  if (parentCtx.selectObservers[key] === undefined) {
    parentCtx.selectObservers[key] = []
  }
  parentCtx.selectObservers[key].push(callback)
}

const doBindSelectAttr = function (ctx, attribute) {
  const boundAttr = createBoundAttr(attribute)
  boundAttr.init = (attrName, element) =>
    subscribeSelect(ctx, () => setAttribute(attrName, attribute(), element))
  return boundAttr
}

function createBoundAttr (attr) {
  if (typeof attr !== 'function') {
    throw new Error('You must pass a function to bindAttr')
  }
  // wrap the function to avoid modifying it
  const boundAttr = () => attr()
  boundAttr.isBoundAttribute = true
  return boundAttr
}

function doBindAttr (state, attribute) {
  const boundAttr = createBoundAttr(attribute)
  boundAttr.init = (attrName, element) => state.subscribe(() => setAttribute(attrName, attribute(), element))
  return boundAttr
}

function doBindStyle (state, style) {
  if (typeof style !== 'function') {
    throw new Error('You must pass a function to bindStyle')
  }
  const boundStyle = () => style()
  boundStyle.isBoundStyle = true
  boundStyle.init = (styleName, element) => state.subscribe(() => { element.style[styleName] = style() })
  return boundStyle
}

function doReset (ctx, reInit, initialValue) {
  ctx.observers = []
  ctx.selectObservers = {}
  if (reInit) {
    ctx.currentValue = initialValue
  }
}

function doSelect (ctx, key) {
  const currentSelected = ctx.selected
  ctx.selected = key
  if (ctx.selectObservers[currentSelected] !== undefined) {
    for (const obs of ctx.selectObservers[currentSelected]) obs()
  }
  if (ctx.selectObservers[ctx.selected] !== undefined) {
    for (const obs of ctx.selectObservers[ctx.selected]) obs()
  }
}

function doBindChildren (ctx, parent, element, update) {
  parent = renderNode(parent)
  if (parent === undefined || parent.nodeType === undefined) {
    throw new Error('You must provide a parent element to bind the children to. aka Need Bukkit.')
  }
  if (typeof element !== 'function' && typeof update !== 'function') {
    throw new Error('You must pass an update function when passing a non function element')
  }
  if (typeof ctx.mapKey !== 'function') {
    console.warn('Using value index as key, may not work correctly when moving items...')
    ctx.mapKey = (o, i) => i
  }

  if (!Array.isArray(ctx.currentValue)) {
    throw new Error('You can only use bindChildren with a state that contains an array. try myState([mystate]) before calling this function.')
  }
  ctx.currentValue = ctx.currentValue.map(v => v.isFnState ? v : fnstate(v))
  ctx.bindContexts.push({ element, update, parent })
  ctx.state.subscribe((newState, oldState) => {
    if (!Array.isArray(ctx.currentValue)) {
      console.warn('A state used with bindChildren was updated to a non array value. This will be converted to an array of 1 and the state will be updated.')
      new Promise((resolve) => {
        ctx.state([ctx.currentValue])
        resolve()
      }).catch(e => {
        console.error('Failed to update element: ')
        console.dir(element)
        const err = new Error('Failed to update element')
        err.stack += '\nCaused by: ' + e.stack
        throw e
      })
    } else {
      reconcile(ctx, oldState)
    }
  })
  reconcile(ctx)
  return parent
}

const doBind = function (ctx, element, update, handleUpdate, handleReplace) {
  if (typeof element !== 'function' && typeof update !== 'function') {
    throw new Error('You must pass an update function when passing a non function element')
  }
  if (typeof update === 'function') {
    const boundElement = renderNode(evaluateElement(element, ctx.currentValue))
    handleUpdate(boundElement)
    return boundElement
  } else {
    const elCtx = { current: renderNode(evaluateElement(element, ctx.currentValue)) }
    handleReplace(elCtx)
    return () => elCtx.current
  }
}

const updateReplacer = (ctx, element, elCtx) => () => {
  let rendered = renderNode(evaluateElement(element, ctx.currentValue))
  if (rendered !== undefined) {
    if (elCtx.current.key !== undefined) {
      rendered.current.key = elCtx.current.key
    }
    if (ctx.parentCtx) {
      for (const bindContext of ctx.parentCtx.bindContexts) {
        bindContext.boundElementByKey[elCtx.current.key] = rendered
      }
    }
    // Perform this action on the next event loop to give the parent a chance to render
    new Promise((resolve) => {
      elCtx.current.replaceWith(rendered)
      elCtx.current = rendered
      rendered = null
      resolve()
    }).catch(e => {
      console.error('Failed to replace element with new element')
      console.dir(elCtx, rendered)
      const err = new Error('Failed to replace element with new element')
      err.stack += '\nCaused by: ' + e.stack
      throw e
    })
  }
}

const doBindSelect = (ctx, element, update) =>
  doBind(ctx, element, update,
    boundElement =>
      subscribeSelect(ctx, () => update(boundElement)),
    (elCtx) =>
      subscribeSelect(
        ctx,
        updateReplacer(ctx, element, elCtx)
      )
  )

const doBindAs = (ctx, element, update) =>
  doBind(ctx, element, update,
    boundElement => {
      ctx.state.subscribe(() => update(boundElement))
    },
    (elCtx) =>
      ctx.state.subscribe(updateReplacer(ctx, element, elCtx))
  )

/**
 * Reconcile the state of the current array value with the state of the bound elements
 */
function reconcile (ctx, oldState) {
  for (const bindContext of ctx.bindContexts) {
    if (bindContext.boundElementByKey === undefined) {
      bindContext.boundElementByKey = {}
    }
    arrangeElements(ctx, bindContext, oldState)
  }
}

function keyMapper (mapKey, value) {
  if (typeof value !== 'object') {
    return value
  } else if (typeof mapKey !== 'function') {
    return 0
  } else {
    return mapKey(value)
  }
}

function arrangeElements (ctx, bindContext, oldState) {
  if (!ctx?.currentValue?.length) {
    bindContext.parent.textContent = ''
    bindContext.boundElementByKey = {}
    ctx.selectObservers = {}
    return
  }

  const keys = {}
  const keysArr = []
  for (const i in ctx.currentValue) {
    let valueState = ctx.currentValue[i]
    if (valueState === null || valueState === undefined || !valueState.isFnState) {
      valueState = ctx.currentValue[i] = fnstate(valueState)
    }
    const key = keyMapper(ctx.mapKey, valueState())
    if (keys[key]) {
      if (oldState) ctx.state(oldState)
      throw new Error('Duplicate keys in a bound array are not allowed, state reset to previous value.')
    }
    keys[key] = i
    keysArr[i] = key
  }

  let prev = null
  const parent = bindContext.parent

  for (let i = ctx.currentValue.length - 1; i >= 0; i--) {
    const key = keysArr[i]
    const valueState = ctx.currentValue[i]
    let current = bindContext.boundElementByKey[key]
    let isNew = false
    // ensure the parent state is always set and can be accessed by the child states to lsiten to the selection change and such
    if (valueState.parentCtx === undefined) {
      valueState.parentCtx = ctx
    }
    if (current === undefined) {
      isNew = true
      current = bindContext.boundElementByKey[key] = renderNode(evaluateElement(bindContext.element, valueState))
      current.key = key
    }
    // place the element in the parent
    if (prev == null) {
      if (!parent.lastChild || parent.lastChild.key !== current.key) {
        parent.append(current)
      }
    } else {
      if (prev.previousSibling === null) {
        // insertAdjacentElement is faster, but some nodes don't have it (lookin' at you text)
        if (prev.insertAdjacentElement !== undefined && current.insertAdjacentElement !== undefined) {
          prev.insertAdjacentElement('beforeBegin', current)
        } else {
          parent.insertBefore(current, prev)
        }
      } else if (prev.previousSibling.key !== current.key) {
        // the previous was deleted all together, so we will delete it and replace the element
        if (keys[prev.previousSibling.key] === undefined) {
          delete bindContext.boundElementByKey[prev.previousSibling.key]
          if (ctx.selectObservers[prev.previousSibling.key] !== undefined && current.insertAdjacentElement !== undefined) {
            delete ctx.selectObservers[prev.previousSibling.key]
          }
          prev.previousSibling.replaceWith(current)
        } else if (isNew) {
          // insertAdjacentElement is faster, but some nodes don't have it (lookin' at you text)
          if (prev.insertAdjacentElement !== undefined) {
            prev.insertAdjacentElement('beforeBegin', current)
          } else {
            parent.insertBefore(current, prev)
          }
        } else {
          // if it's an existing key, replace the current object with the correct object
          prev.previousSibling.replaceWith(current)
        }
      }
    }
    prev = current
  }

  // catch any strays
  for (const key in bindContext.boundElementByKey) {
    if (keys[key] === undefined) {
      bindContext.boundElementByKey[key].remove()
      delete bindContext.boundElementByKey[key]
      if (ctx.selectObservers[key] !== undefined) {
        delete ctx.selectObservers[key]
      }
    }
  }
}

const evaluateElement = (element, value) => {
  if (element.isFnState) {
    return element()
  } else {
    return typeof element === 'function' ? element(value) : element
  }
}

/**
 * Convert non objects (objects are assumed to be nodes) to text nodes and allow promises to resolve to nodes
 */
export const renderNode = (node) => {
  if (node && node.isTemplatePlaceholder) {
    const element = h('div')
    node(element, 'node')
    return element
  } else if (node && typeof node === 'object') {
    if (typeof node.then === 'function') {
      let temp = h('div', { style: 'display:none', class: 'fntags-promise-marker' })
      node.then(el => {
        temp.replaceWith(renderNode(el))
        temp = null
      }).catch(e => console.error('Caught failed node promise.', e))
      return temp
    } else {
      return node
    }
  } else if (typeof node === 'function') {
    return renderNode(node())
  } else {
    return document.createTextNode(node + '')
  }
}

/**
 * All of these attributes must be set to an actual boolean to function correctly
 */
const booleanAttributes = {
  allowfullscreen: true,
  allowpaymentrequest: true,
  async: true,
  autofocus: true,
  autoplay: true,
  checked: true,
  controls: true,
  default: true,
  disabled: true,
  formnovalidate: true,
  hidden: true,
  ismap: true,
  itemscope: true,
  loop: true,
  multiple: true,
  muted: true,
  nomodule: true,
  novalidate: true,
  open: true,
  playsinline: true,
  readonly: true,
  required: true,
  reversed: true,
  selected: true,
  truespeed: true
}

const setAttribute = function (attrName, attr, element) {
  if (typeof attr === 'function') {
    if (attr.isBoundAttribute) {
      attr.init(attrName, element)
      attr = attr()
    } else if (attr.isTemplatePlaceholder) {
      attr(element, 'attr', attrName)
      return
    } else if (attrName.startsWith('on')) {
      element.addEventListener(attrName.substring(2), attr)
      return
    } else {
      attr = attr()
    }
  }
  if (attrName === 'style' && typeof attr === 'object') {
    for (const style in attr) {
      setStyle(style, attr[style], element)
    }
  } else if (element.__fnselector && element.className && attrName === 'class') {
    // special handling for class to ensure the selector classes from fntemplate don't get overwritten
    element.className += ` ${attr}`
  } else if (attrName === 'value') {
    element.setAttribute('value', attr)
    // html5 nodes like range don't update unless the value property on the object is set
    element.value = attr
  } else if (booleanAttributes[attrName]) {
    element[attrName] = !!attr
  } else {
    let ns = null
    const nsIndex = hasNs(attrName)
    if (nsIndex > -1) {
      const split = splitNs(attrName, nsIndex)
      ns = split.ns
      attrName = split.val
    }
    element.setAttributeNS(ns, attrName, attr)
  }
}

const setStyle = (style, styleValue, element) => {
  if (typeof styleValue === 'function') {
    if (styleValue.isBoundStyle) {
      styleValue.init(style, element)
      styleValue = styleValue()
    } else if (styleValue.isTemplatePlaceholder) {
      styleValue(element, 'style', style)
      return
    } else {
      styleValue = styleValue()
    }
  }
  element.style[style] = styleValue && styleValue.toString()
}

export const isAttrs = (val) => val && typeof val === 'object' && val.nodeType === undefined && !Array.isArray(val) && typeof val.then !== 'function'
/**
 * helper to get the attr object
 */
export const getAttrs = (children) => Array.isArray(children) && isAttrs(children[0]) ? children[0] : {}

/**
 * A function to create an element with a pre-defined style.
 * For example, the flex* elements in fnelements.
 *
 * @param style
 * @param tag
 * @param children
 * @return {*}
 */
export const styled = (style, tag, children) => {
  const firstChild = children[0]
  if (isAttrs(firstChild)) {
    if (typeof firstChild.style === 'string') {
      firstChild.style = [stringifyStyle(style), stringifyStyle(firstChild.style)].join(';')
    } else {
      firstChild.style = Object.assign(style, firstChild.style)
    }
  } else {
    children.unshift({ style })
  }
  return h(tag, ...children)
}

const stringifyStyle = style =>
  typeof style === 'string'
    ? style
    : Object.keys(style).map(prop => `${prop}:${style[prop]}`).join(';')
