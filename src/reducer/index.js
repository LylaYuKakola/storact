/**
 * @desc 提供基本的dispatch操作，主要针对list和map
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
} from '../utils/constants'
import { List, fromJS } from 'immutable'
import { error } from '../utils/log'

// 提供基础的state操作
export default (state, action) => {
  const { type, payload } = action

  // keys表示要修改的每层的key的集合（数组则为数组下标）
  // value表示要更新的值，merge和update有不同的操作
  const { keys, data } = (payload || {})

  if (type === MERGE) {
    return state.mergeIn(keys, data)
  }

  if (type === UPDATE) {
    return state.setIn(keys, fromJS(data))
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
      error('Type "PUSH" of dispatch did not act on a target which is not a List instance')
      return state
    }
    return state.setIn(keys, data instanceof Array ? target.push(...data) : target.push(data))
  }

  if (type === POP) {
    const target = state.getIn(keys)
    if (!target) return state
    if (!List.isList(target)) {
      error('Type "POP" of dispatch did not act on a target which is not a List instance')
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
    return state.setIn(keys, data instanceof Array ? target.unshift(...data) : target.unshift(data))
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

  console.warn(`there is no dispatch of "${String(type)}"`)
  return state // 保证state不丢失
}
