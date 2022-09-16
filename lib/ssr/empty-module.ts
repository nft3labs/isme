/**
 * default replace
 */
const emptyModule: any = function () {
  return emptyModule
}

emptyModule.__proto__.toString = () => '[ssr-exclude-module] empty-module (default replace)'

export default emptyModule
