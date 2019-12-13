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
export const PEND = '_pend_'
export const DEBOUNCE = '_debounce_'
export const THROTTLE = '_throttle_'
export const DELAY = '_delay_'
/* **************************************** */
