/**
 * @desc 常量
 */

/* ********* dispatch的基本类型 ********** */
export const UPDATE = Symbol('update')
export const DELETE = Symbol('delete')
export const CLEAR = Symbol('clear')
export const REVERT = Symbol('revert')

// Map修改
export const MERGE = Symbol('merge')

// List修改
export const PUSH = Symbol('push')
export const POP = Symbol('pop')
export const SHIFT = Symbol('shift')
export const UNSHIFT = Symbol('unShift')
export const INSERT = Symbol('insert')

// reducer内部的操作，触发记录当前state的操作
export const _SAVE_CURRENT_STATE_ = Symbol('saveCurrentState')
/* ************************************* */

/* ********* dispatch的config类型 ********** */
export const PEND = Symbol('pend')
export const DEBOUNCE = Symbol('debounce')
export const THROTTLE = Symbol('throttle')
export const DELAY = Symbol('delay')
/* ************************************* */

