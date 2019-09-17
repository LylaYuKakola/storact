/**
 * @desc 常量
 */

/* ********* dispatch的基本类型 ********** */
export const UPDATE = Symbol('update')
export const DELETE = Symbol('delete')
export const CLEAR = Symbol('clear')

// Map修改
export const MERGE = Symbol('merge')

// List修改
export const PUSH = Symbol('push')
export const POP = Symbol('pop')
export const SHIFT = Symbol('shift')
export const UNSHIFT = Symbol('unShift')
export const INSERT = Symbol('insert')
/* ************************************* */

/* ********* dispatch的config类型 ********** */
export const PEND = Symbol('pend')
export const DEBOUNCE = Symbol('debounce')
export const THROTTLE = Symbol('throttle')
export const DELAY = Symbol('delay')
/* ************************************* */

