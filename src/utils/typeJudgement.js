/**
 * @desc 类型判断
 */

export const isFunction = arg => ['[object Function]', '[object AsyncFunction]'].includes(Object.prototype.toString.call(arg))
export const isAsyncFunction = arg => Object.prototype.toString.call(arg) === '[object AsyncFunction]'
export const isArray = arg => Object.prototype.toString.call(arg) === '[object Array]'
export const isString = arg => Object.prototype.toString.call(arg) === '[object String]'
export const isNull = arg => Object.prototype.toString.call(arg) === '[object Null]'
export const isUndefined = arg => Object.prototype.toString.call(arg) === '[object Undefined]'
export const isUsableNumber = arg => !Number.isNaN(parseFloat(arg))
