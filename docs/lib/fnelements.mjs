import { h, styled } from './fntags.mjs'

/**
 * @type {function(...[*]=): HTMLAnchorElement}
 */
export const a = (...children) => h('a', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const abbr = (...children) => h('abbr', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const acronym = (...children) => h('acronym', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const address = (...children) => h('address', ...children)

/**
 * @type {function(...[*]=): HTMLAreaElement}
 */
export const area = (...children) => h('area', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const article = (...children) => h('article', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const aside = (...children) => h('aside', ...children)

/**
 * @type {function(...[*]=): HTMLAudioElement}
 */
export const audio = (...children) => h('audio', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const b = (...children) => h('b', ...children)

/**
 * @type {function(...[*]=): HTMLBaseElement}
 */
export const base = (...children) => h('base', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const bdi = (...children) => h('bdi', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const bdo = (...children) => h('bdo', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const big = (...children) => h('big', ...children)

/**
 * @type {function(...[*]=): HTMLQuoteElement}
 */
export const blockquote = (...children) => h('blockquote', ...children)

/**
 * @type {function(...[*]=): HTMLBodyElement}
 */
export const body = (...children) => h('body', ...children)

/**
 * @type {function(...[*]=): HTMLBRElement}
 */
export const br = (...children) => h('br', ...children)

/**
 * @type {function(...[*]=): HTMLButtonElement}
 */
export const button = (...children) => h('button', ...children)

/**
 * @type {function(...[*]=): HTMLCanvasElement}
 */
export const canvas = (...children) => h('canvas', ...children)

/**
 * @type {function(...[*]=): HTMLTableCaptionElement}
 */
export const caption = (...children) => h('caption', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const cite = (...children) => h('cite', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const code = (...children) => h('code', ...children)

/**
 * @type {function(...[*]=): HTMLTableColElement}
 */
export const col = (...children) => h('col', ...children)

/**
 * @type {function(...[*]=): HTMLTableColElement}
 */
export const colgroup = (...children) => h('colgroup', ...children)

/**
 * @type {function(...[*]=): HTMLDataElement}
 */
export const data = (...children) => h('data', ...children)

/**
 * @type {function(...[*]=): HTMLDataListElement}
 */
export const datalist = (...children) => h('datalist', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const dd = (...children) => h('dd', ...children)

/**
 * @type {function(...[*]=): HTMLModElement}
 */
export const del = (...children) => h('del', ...children)

/**
 * @type {function(...[*]=): HTMLDetailsElement}
 */
export const details = (...children) => h('details', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const dfn = (...children) => h('dfn', ...children)

/**
 * @type {function(...[*]=): HTMLDialogElement}
 */
export const dialog = (...children) => h('dialog', ...children)

/**
 * @type {function(...[*]=): HTMLDirectoryElement}
 */
export const dir = (...children) => h('dir', ...children)

/**
 * @type {function(...[*]=): HTMLDivElement}
 */
export const div = (...children) => h('div', ...children)

/**
 * @type {function(...[*]=): HTMLDListElement}
 */
export const dl = (...children) => h('dl', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const dt = (...children) => h('dt', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const em = (...children) => h('em', ...children)

/**
 * @type {function(...[*]=): HTMLEmbedElement}
 */
export const embed = (...children) => h('embed', ...children)

/**
 * @type {function(...[*]=): HTMLFieldSetElement}
 */
export const fieldset = (...children) => h('fieldset', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const figcaption = (...children) => h('figcaption', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const figure = (...children) => h('figure', ...children)

/**
 * @type {function(...[*]=): HTMLDivElement}
 */
export const flexCol = (...children) => styled(
  {
    display: 'flex',
    'flex-direction': 'column'
  },
  'div',
  children
)

/**
 * @type {function(...[*]=): HTMLDivElement}
 */
export const flexCenteredCol = (...children) => styled(
  {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center'
  },
  'div',
  children
)

/**
 * @type {function(...[*]=): HTMLDivElement}
 */
export const flexRow = (...children) => styled(
  {
    display: 'flex',
    'flex-direction': 'row'
  },
  'div',
  children
)

/**
 * @type {function(...[*]=): HTMLDivElement}
 */
export const flexCenteredRow = (...children) => styled(
  {
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'center'
  },
  'div',
  children
)

/**
 * @type {function(...[*]=): HTMLFontElement}
 */
export const font = (...children) => h(font, ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const footer = (...children) => h('footer', ...children)

/**
 * @type {function(...[*]=): HTMLFormElement}
 */
export const form = (...children) => h('form', ...children)

/**
 * @type {function(...[*]=): HTMLFrameElement}
 */
export const frame = (...children) => h('frame', ...children)

/**
 * @type {function(...[*]=): HTMLFrameSetElement}
 */
export const frameset = (...children) => h('frameset', ...children)

/**
 * @type {function(...[*]=): HTMLHeadingElement}
 */
export const h1 = (...children) => h('h1', ...children)

/**
 * @type {function(...[*]=): HTMLHeadingElement}
 */
export const h2 = (...children) => h('h2', ...children)

/**
 * @type {function(...[*]=): HTMLHeadingElement}
 */
export const h3 = (...children) => h('h3', ...children)

/**
 * @type {function(...[*]=): HTMLHeadingElement}
 */
export const h4 = (...children) => h('h4', ...children)

/**
 * @type {function(...[*]=): HTMLHeadingElement}
 */
export const h5 = (...children) => h('h5', ...children)

/**
 * @type {function(...[*]=): HTMLHeadingElement}
 */
export const h6 = (...children) => h('h6', ...children)

/**
 * @type {function(...[*]=): HTMLHeadElement}
 */
export const head = (...children) => h('head', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const header = (...children) => h('header', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const hgroup = (...children) => h('hgroup', ...children)

/**
 * @type {function(...[*]=): HTMLHRElement}
 */
export const hr = (...children) => h('hr', ...children)

/**
 * @type {function(...[*]=): HTMLHtmlElement}
 */
export const html = (...children) => h('html', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const i = (...children) => h('i', ...children)

/**
 * @type {function(...[*]=): HTMLIFrameElement}
 */
export const iframe = (...children) => h('iframe', ...children)

/**
 * @type {function(...[*]=): HTMLImageElement}
 */
export const img = (...children) => h('img', ...children)

/**
 * @type {function(...[*]=): HTMLInputElement}
 */
export const input = (...children) => h('input', ...children)

/**
 * @type {function(...[*]=): HTMLModElement}
 */
export const ins = (...children) => h('ins', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const kbd = (...children) => h('kbd', ...children)

/**
 * @type {function(...[*]=): HTMLLabelElement}
 */
export const label = (...children) => h('label', ...children)

/**
 * @type {function(...[*]=): HTMLLegendElement}
 */
export const legend = (...children) => h('legend', ...children)

/**
 * @type {function(...[*]=): HTMLLIElement}
 */
export const li = (...children) => h('li', ...children)

/**
 * @type {function(...[*]=): HTMLLinkElement}
 */
export const link = (...children) => h('link', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const main = (...children) => h('main', ...children)

/**
 * @type {function(...[*]=): HTMLMapElement}
 */
export const map = (...children) => h('map', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const mark = (...children) => h('mark', ...children)

/**
 * The best html element for every occasion.
 * @type {function(...[*]=): HTMLMarqueeElement}
 */
export const marquee = (...children) => h('marquee', ...children)

/**
 * @type {function(...[*]=): HTMLMenuElement}
 */
export const menu = (...children) => h('menu', ...children)

/**
 * @type {function(...[*]=): HTMLMetaElement}
 */
export const meta = (...children) => h('meta', ...children)

/**
 * @type {function(...[*]=): HTMLMeterElement}
 */
export const meter = (...children) => h('meter', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const nav = (...children) => h('nav', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const noframes = (...children) => h('noframes', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const noscript = (...children) => h('noscript', ...children)

/**
 * @type {function(...[*]=): HTMLObjectElement}
 */
export const object = (...children) => h('object', ...children)

/**
 * @type {function(...[*]=): HTMLOListElement}
 */
export const ol = (...children) => h('ol', ...children)

/**
 * @type {function(...[*]=): HTMLOptGroupElement}
 */
export const optgroup = (...children) => h('optgroup', ...children)

/**
 * @type {function(...[*]=): HTMLOptionElement}
 */
export const option = (...children) => h('option', ...children)

/**
 * @type {function(...[*]=): HTMLOutputElement}
 */
export const output = (...children) => h('output', ...children)

/**
 * @type {function(...[*]=): HTMLParagraphElement}
 */
export const p = (...children) => h('p', ...children)

/**
 * @type {function(...[*]=): HTMLParamElement}
 */
export const param = (...children) => h('param', ...children)

/**
 * @type {function(...[*]=): HTMLPictureElement}
 */
export const picture = (...children) => h('picture', ...children)

/**
 * @type {function(...[*]=): HTMLPreElement}
 */
export const pre = (...children) => h('pre', ...children)

/**
 * @type {function(...[*]=): HTMLProgressElement}
 */
export const progress = (...children) => h('progress', ...children)

/**
 * @type {function(...[*]=): HTMLQuoteElement}
 */
export const q = (...children) => h('q', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const rp = (...children) => h('rp', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const rt = (...children) => h('rt', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const ruby = (...children) => h('ruby', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const s = (...children) => h('s', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const samp = (...children) => h('samp', ...children)

/**
 * @type {function(...[*]=): HTMLScriptElement}
 */
export const script = (...children) => h('script', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const section = (...children) => h('section', ...children)

/**
 * @type {function(...[*]=): HTMLSelectElement}
 */
export const select = (...children) => h('select', ...children)

/**
 * @type {function(...[*]=): HTMLSlotElement}
 */
export const slot = (...children) => h('slot', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const small = (...children) => h('small', ...children)

/**
 * @type {function(...[*]=): HTMLSourceElement}
 */
export const source = (...children) => h('source', ...children)

/**
 * @type {function(...[*]=): HTMLSpanElement}
 */
export const span = (...children) => h('span', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const strong = (...children) => h('strong', ...children)

/**
 * @type {function(...[*]=): HTMLStyleElement}
 */
export const style = (...children) => h('style', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const sub = (...children) => h('sub', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const summary = (...children) => h('summary', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const sup = (...children) => h('sup', ...children)

/**
 * @type {function(...[*]=): HTMLTableElement}
 */
export const table = (...children) => h('table', ...children)

/**
 * @type {function(...[*]=): HTMLTableSectionElement}
 */
export const tbody = (...children) => h('tbody', ...children)

/**
 * @type {function(...[*]=): HTMLTableDataCellElement}
 */
export const td = (...children) => h('td', ...children)

/**
 * @type {function(...[*]=): HTMLTemplateElement}
 */
export const template = (...children) => h('template', ...children)

/**
 * @type {function(...[*]=): HTMLTextAreaElement}
 */
export const textarea = (...children) => h('textarea', ...children)

/**
 * @type {function(...[*]=): HTMLTableSectionElement}
 */
export const tfoot = (...children) => h('tfoot', ...children)

/**
 * @type {function(...[*]=): HTMLTableHeaderCellElement}
 */
export const th = (...children) => h('th', ...children)

/**
 * @type {function(...[*]=): HTMLTableSectionElement}
 */
export const thead = (...children) => h('thead', ...children)

/**
 * @type {function(...[*]=): HTMLTimeElement}
 */
export const time = (...children) => h('time', ...children)

/**
 * @type {function(...[*]=): HTMLTitleElement}
 */
export const title = (...children) => h('title', ...children)

/**
 * @type {function(...[*]=): HTMLTableRowElement}
 */
export const tr = (...children) => h('tr', ...children)

/**
 * @type {function(...[*]=): HTMLTrackElement}
 */
export const track = (...children) => h('track', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const tt = (...children) => h('tt', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const u = (...children) => h('u', ...children)

/**
 * @type {function(...[*]=): HTMLUListElement}
 */
export const ul = (...children) => h('ul', ...children)

/**
 * name conflicts with js syntax
 *
 * @type {function(...[*]=): HTMLElement}
 */
export const var_ = (...children) => h('var', ...children)

/**
 * @type {function(...[*]=): HTMLVideoElement}
 */
export const video = (...children) => h('video', ...children)

/**
 * @type {function(...[*]=): HTMLElement}
 */
export const wbr = (...children) => h('wbr', ...children)
