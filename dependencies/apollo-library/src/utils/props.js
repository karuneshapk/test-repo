/* global __DEV__ */

const arrayToHash = array => {
  return array.reduce((accu, key) => {
    accu[key] = true
    return accu
  }, {})
}

const GLOBAL_EVENT_HANDLER_ATTRIBUTES = arrayToHash([
  'onabort',
  'onautocomplete',
  'onautocompleteerror',
  'onblur',
  'oncancel',
  'oncanplay',
  'oncanplaythrough',
  'onchange',
  'onclick',
  'onclose',
  'oncontextmenu',
  'oncuechange',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragexit',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onfocus',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreset',
  'onresize',
  'onscroll',
  'onseeked',
  'onseeking',
  'onselect',
  'onshow',
  'onsort',
  'onstalled',
  'onsubmit',
  'onsuspend',
  'ontimeupdate',
  'ontoggle',
  'onvolumechange',
  'onwaiting'
])

const SVG_ATTRIBUTES = arrayToHash([
  'accentheight',
  'accumulate',
  'additive',
  'alignmentbaseline',
  'allowreorder',
  'alphabetic',
  'amplitude',
  'arabicform',
  'ascent',
  'attributename',
  'attributetype',
  'autoreverse',
  'azimuth',
  'basefrequency',
  'baseprofile',
  'baselineshift',
  'bbox',
  'begin',
  'bias',
  'by',
  'calcmode',
  'capheight',
  'clip',
  'clippath',
  'clippathunits',
  'cliprule',
  'colorinterpolation',
  'colorinterpolationfilters',
  'colorprofile',
  'colorrendering',
  'contentscripttype',
  'contentstyletype',
  'cursor',
  'cx',
  'cy',
  'd',
  'decelerate',
  'descent',
  'diffuseconstant',
  'direction',
  'display',
  'divisor',
  'dominantbaseline',
  'dur',
  'dx',
  'dy',
  'edgemode',
  'elevation',
  'enablebackground',
  'end',
  'exponent',
  'externalresourcesrequired',
  'fill',
  'fillopacity',
  'fillrule',
  'filter',
  'filterres',
  'filterunits',
  'floodcolor',
  'floodopacity',
  'focusable',
  'fontfamily',
  'fontsize',
  'fontsizeadjust',
  'fontstretch',
  'fontstyle',
  'fontvariant',
  'fontweight',
  'format',
  'from',
  'fx',
  'fy',
  'g1',
  'g2',
  'glyphname',
  'glyphorientationhorizontal',
  'glyphorientationvertical',
  'glyphref',
  'gradienttransform',
  'gradientunits',
  'hanging',
  'horizadvx',
  'horizoriginx',
  'ideographic',
  'imagerendering',
  'in',
  'in2',
  'intercept',
  'k',
  'k1',
  'k2',
  'k3',
  'k4',
  'kernelmatrix',
  'kernelunitlength',
  'kerning',
  'keypoints',
  'keysplines',
  'keytimes',
  'lengthadjust',
  'letterspacing',
  'lightingcolor',
  'limitingconeangle',
  'local',
  'markerend',
  'markerheight',
  'markermid',
  'markerstart',
  'markerunits',
  'markerwidth',
  'mask',
  'maskcontentunits',
  'maskunits',
  'mathematical',
  'mode',
  'numoctaves',
  'offset',
  'opacity',
  'operator',
  'order',
  'orient',
  'orientation',
  'origin',
  'overflow',
  'overlineposition',
  'overlinethickness',
  'paintorder',
  'panose1',
  'pathlength',
  'patterncontentunits',
  'patterntransform',
  'patternunits',
  'pointerevents',
  'points',
  'pointsatx',
  'pointsaty',
  'pointsatz',
  'preservealpha',
  'preserveaspectratio',
  'primitiveunits',
  'r',
  'radius',
  'refx',
  'refy',
  'renderingintent',
  'repeatcount',
  'repeatdur',
  'requiredextensions',
  'requiredfeatures',
  'restart',
  'result',
  'rotate',
  'rx',
  'ry',
  'scale',
  'seed',
  'shaperendering',
  'slope',
  'spacing',
  'specularconstant',
  'specularexponent',
  'speed',
  'spreadmethod',
  'startoffset',
  'stddeviation',
  'stemh',
  'stemv',
  'stitchtiles',
  'stopcolor',
  'stopopacity',
  'strikethroughposition',
  'strikethroughthickness',
  'string',
  'stroke',
  'strokedasharray',
  'strokedashoffset',
  'strokelinecap',
  'strokelinejoin',
  'strokemiterlimit',
  'strokeopacity',
  'strokewidth',
  'surfacescale',
  'systemlanguage',
  'tablevalues',
  'targetx',
  'targety',
  'textanchor',
  'textdecoration',
  'textlength',
  'textrendering',
  'to',
  'transform',
  'u1',
  'u2',
  'underlineposition',
  'underlinethickness',
  'unicode',
  'unicodebidi',
  'unicoderange',
  'unitsperem',
  'valphabetic',
  'vhanging',
  'videographic',
  'vmathematical',
  'values',
  'vectoreffect',
  'version',
  'vertadvy',
  'vertoriginx',
  'vertoriginy',
  'viewbox',
  'viewtarget',
  'visibility',
  'widths',
  'wordspacing',
  'writingmode',
  'x',
  'x1',
  'x2',
  'xchannelselector',
  'xheight',
  'xlinkactuate',
  'xlinkarcrole',
  'xlinkhref',
  'xlinkrole',
  'xlinkshow',
  'xlinktitle',
  'xlinktype',
  'xmlbase',
  'xmllang',
  'xmlspace',
  'y',
  'y1',
  'y2',
  'ychannelselector',
  'z',
  'zoomandpan'
])

// https://www.w3.org/TR/html-markup/global-attributes.html
const GLOBAL_ATTRIBUTES = arrayToHash([
  'accesskey',
  'contenteditable',
  'classname',
  'contextmenu',
  'dir',
  'draggable',
  'dropzone',
  'hidden',
  'id',
  'lang',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate'
])

const GLOBAL_ATTRIBUTES_ALL = {
  ...GLOBAL_EVENT_HANDLER_ATTRIBUTES,
  ...GLOBAL_ATTRIBUTES
}

const INPUT_ATTRIBUTES = arrayToHash([
  'value',
  'readonly',
  'disabled',
  'size',
  'maxlength',
  'autocomplete',
  'autofocus',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'height',
  'width',
  'name',
  'list',
  'min',
  'max',
  'multiple',
  'pattern',
  'placeholder',
  'required',
  'type',
  'step',
  'checked',
  'defaultvalue',
  'defaultchecked'
])

const BUTTON_ATTRIBUTES = arrayToHash([
  'autofocus',
  'disabled',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'post',
  'formnovalidate',
  'formtarget',
  'framename',
  'name',
  'type',
  'reset',
  'submit',
  'value'
])

// http://www.w3schools.com/tags/tag_a.asp
const A_ATTRIBUTES = arrayToHash([
  'charset',
  'coords',
  'download',
  'href',
  'hreflang',
  'media',
  'name',
  'rel',
  'rev',
  'shape',
  'rect',
  'circle',
  'poly',
  'target',
  'framename',
  'type'
])

/**
 * Function is used internally for filtering all dom/input/etc props.
 * This is used with preprocessed matching hash (map) and we iterate through object keys only
 *
 * @param {Object} props - props we want to filter (source)
 * @param {Object} whiteListProps - a map of whitelisted props for matching
 *
 * @returns {Object}
 */
const filterProps = (props, whiteListProps = {}) => {
  return Object.keys(props).reduce((newProps, key) => {
    if (whiteListProps[key.toLowerCase()] || (/(aria|data)\-/i).test(key)) {
      newProps[key] = props[key]
    }
    return newProps
  }, {})
}

/**
 * Creates a filtering function for given attributes
 *
 * @param {Object} attributes - a hash (map) of attributes to filter
 * @returns {function}
 */
const createFilterPropsFunction = (attributes) => {
  if (__DEV__) {
    return (props, additionalWhiteList) => {
      const attrs = additionalWhiteList && additionalWhiteList.length
        ? {
          ...attributes,
          ...arrayToHash(additionalWhiteList)
        }
        : attributes

      return filterProps(props, attrs)
    }
  } else {
    return props => props
  }
}

export const filterDOMNodeProps = createFilterPropsFunction(GLOBAL_ATTRIBUTES_ALL)

export const filterInputProps = createFilterPropsFunction({
  ...GLOBAL_ATTRIBUTES_ALL,
  ...INPUT_ATTRIBUTES
})

export const filterButtonProps = createFilterPropsFunction({
  ...GLOBAL_ATTRIBUTES_ALL,
  ...BUTTON_ATTRIBUTES
})

export const filterAProps = createFilterPropsFunction({
  ...GLOBAL_ATTRIBUTES_ALL,
  ...A_ATTRIBUTES
})

export const filterSvgProps = createFilterPropsFunction({
  ...GLOBAL_ATTRIBUTES_ALL,
  ...SVG_ATTRIBUTES
})
