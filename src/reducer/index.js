/**
 * @desc 提供基本的dispatch操作
 */

import {
  UPDATE,
  DELETE,
  CLEAR,
  MERGE,
  PUSH,
  POP,
  SHIFT,
  UNSHIFT,
  INSERT,
  REVERT,
  _SAVE_CURRENT_STATE_,
} from '../utils/constants'
import { List } from 'immutable'
import { error, warn } from '../utils/log'

// revert相关
const EMPTY_SYMBOL = Symbol('empty')
const NOTHINF_CHANGED = Symbol('nothingChanged')
const revertMap = new Map()
let currentPointer = 0 // 当前指针

// 提供基础的state操作
export default (state, action) => {
  const { type, payload } = action

  // keys表示要修改的每层的key的集合（数组则为数组下标）
  // value表示要更新的值，merge和update有不同的操作
  const { keys, data } = (payload || {})

  if (type === _SAVE_CURRENT_STATE_) {
    const lastState = revertMap.get(currentPointer - 1)
    if (lastState && lastState === state) return state // 如果和上一个历史state相同，那判定这个记录无效
    if (currentPointer >= 10) {
      revertMap.set(currentPointer - 10, EMPTY_SYMBOL) // 只记录十个历史的state
    }
    revertMap.set(currentPointer, state)
    currentPointer += 1
    console.log(revertMap)
    console.log(currentPointer)
    return state
  }

  if (type === REVERT) {
    const historyState = revertMap.get(currentPointer - 1)
    if (currentPointer === 0 || historyState === EMPTY_SYMBOL) {
      warn('no more history!!!')
      return state
    }
    currentPointer -= 1
    return historyState
  }

  if (type === MERGE) {
    const oldValue = !keys.length ? state : state.getIn(keys)
    if (!oldValue) {
      return state.setIn(keys, data)
    }
    return state.mergeIn(keys, data)
  }

  if (type === UPDATE) {
    return state.setIn(keys, data)
  }

  if (type === DELETE) {
    return state.deleteIn(keys)
  }

  if (type === CLEAR) {
    const target = state.getIn(keys)
    if (!target) return state
    if (['number', 'string'].includes(typeof target)) {
      return state.setIn(keys, null)
    }
    return state.setIn(keys, target.clear())
  }

  if (type === PUSH) {
    const target = state.getIn(keys)
    if (!target) return state
    if (!List.isList(target)) {
      error('Type "PUSH" of dispatch did not act on target which is not a List instance')
      return state
    }
    return state.setIn(keys, target.push(data))
  }

  if (type === POP) {
    const target = state.getIn(keys)
    if (!target) return state
    if (!List.isList(target)) {
      error('Type "POP" of dispatch did not act on target which is not a List instance')
      return state
    }
    return state.setIn(keys, target.pop())
  }

  if (type === SHIFT) {
    const target = state.getIn(keys)
    if (!target) return state
    if (!List.isList(target)) {
      error('Type "SHIFT" of dispatch did not act on target which is not a List instance')
      return state
    }
    return state.setIn(keys, target.shift())
  }

  if (type === UNSHIFT) {
    const target = state.getIn(keys)
    if (!target) return state
    if (!List.isList(target)) {
      error('Type "UNSHIFT" of dispatch did not act on target which is not a List instance')
      return state
    }
    return state.setIn(keys, target.unshift(data))
  }

  if (type === INSERT) {
    const target = state.getIn(keys)
    if (!target) return state
    if (!List.isList(target)) {
      error('Type "INSERT" of dispatch did not act on target which is not a List instance')
      return state
    }
    return state.setIn(keys, target.insert(...data))
  }

  console.warn(`dispatch没有 "${String(type)}" 类型的操作，state修改失败`)
  return state // 保证state不丢失
}
