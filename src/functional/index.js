/**
 * @desc 针对原始传参action的dispatch, 改造为函数式action的集合，应用在enhanced中
 */

import {
  MERGE,
  DELETE,
  UPDATE,
  CLEAR,
  INSERT,
  PUSH,
  POP,
  SHIFT,
  UNSHIFT,
} from '../utils/constants'

const getActurlActionType = (key = '') => {
  if (key === 'merge') return MERGE
  if (key === 'delete') return DELETE
  if (key === 'update') return UPDATE
  if (key === 'clear') return CLEAR
  if (key === 'insert') return INSERT
  if (key === 'push') return PUSH
  if (key === 'pop') return POP
  if (key === 'shift') return SHIFT
  if (key === 'unshift') return UNSHIFT
  return key
}

// 对挂载effect的dispatch进行转换
// 需要给挂载的effect传递 getState, originalDispatch
// 但是不会对args做拆分
export const convertAfterStep1 = (getState, originalDispatch, effects) => {
  const effectKeys = Reflect.ownKeys(effects)
  const effectActiveDispatch = new Proxy(Object.create(null), {
    get: (_t, key) => async (...args) => {
      if (effectKeys.includes(key)) {
        await effects[key]({
          getState,
          dispatch: effectActiveDispatch,
        })(...args)
      } else {
        await Promise.resolve(originalDispatch({
          type: getActurlActionType(key),
          payload: {
            keys: args[0],
            data: args[1],
          },
        }))
      }
    },
  })
  return effectActiveDispatch
}

// 对挂载middleware的dispatch进行转换
// 只需要传入step处理之后又_转换回来的_的dispatch
// ？？这里为什么需要_转换回来的_
// 考虑到中间件的编写规范，还是需要那种基本的dispatch传入action的形式
// 还有就是兼容一些已经成为规范的redux的中间件
export const convertAfterStep2 = dispatch => (
  new Proxy(Object.create(null), {
    get(_t, key) {
      return async (...args) => {
        await dispatch({
          type: key,
          payload: args,
        })
      }
    },
    set() {
      // FREEZE: do nothing
      console.log('original dispatch cannot be changed')
    },
  })
)

// 最终返回的dispatch
// 这里特殊的设置了config的字段特性，用来生成不同config的dispatch
export const convertAfterStep3 = dispatch => {
  const functionalDispatch = new Proxy(Object.create(null), {
    get(_t, key) {
      if (key === 'config') {
        return config => new Proxy(Object.create(null), {
          get(_t, key) {
            return async (...args) => {
              await dispatch({
                type: key,
                payload: args,
                config,
              })
            }
          },
          set: () => {},
        })
      }

      return async (...args) => {
        await dispatch({
          type: key,
          payload: args,
        })
      }
    },
    set: () => {},
  })
  return functionalDispatch
}

