/**
 * @desc 使用middleware增强dispatch
 */

import { useRef, useMemo, useCallback } from 'react'
import { error, warn } from '../utils/log'
import * as tj from '../utils/typeJudgement'

const emptyObject = Object.create(null)

export default function useMiddleware({
  dispatch,
  middlewares,
}) {
  const index = useRef(0)

  return useMemo(() => {
    if (
      !middlewares ||
      !(middlewares instanceof Array) ||
      !middlewares.length ||
      middlewares.some(m => !(tj.isFunction(m)))
    ) {
      return dispatch
    }

    if (!middlewares) return dispatch
    if (!(middlewares instanceof Array)) {
      warn(`"middlewares" should be an array, but get a ${typeof middlewares}`)
      return dispatch
    }
    if (!middlewares.length) {
      warn('"middlewares" is an empty array')
      return dispatch
    }
    if (middlewares.some(m => !(tj.isFunction(m)))) {
      warn(`"middlewares" includes an item which is not a function`)
    }

    return [...middlewares, dispatch].reverse().reduce((next, curr) => {
      return curr(
        dispatch,
        tj.isAsyncFunction(next) ? async (...args) => {
          await next(...args)
        } : next,
      )
    })
  }, [dispatch, middlewares])

  // 获取中间件的handler对象
  // const handlers = useMemo(() => {
  //   if (!middleware) return emptyObject
  //   if (!(tj.isFunction(middleware))) {
  //     error('wrong to load "middleware": expected a function')
  //     return emptyObject
  //   }
  //   return middleware.call(null, dispatch) || {}
  // }, [middleware, dispatch])

  // 因为中间件多为异步操作，
  // 所以需要设置一个阀门，控制同一类型的中间操作不能同时执行两个
  // 这样不会出现对store的修改冲突
  // @TODO 暂时去掉阀门
  // const pendingMap = useRef(new Map())

  // return useMemo(() => async action => {
  //   const { type, payload } = action
  //   // const pendingState = pendingMap.current.get(type)
  //   // if (pendingState) return
  //   // pendingMap.current.set(type, true)
  //   try {
  //     const handler = handlers[type]
  //     if (handler) {
  //       await handler(payload)
  //     } else {
  //       dispatch(action)
  //     }
  //   } catch (error) {
  //     error(`${error.name || 'Unexpected error!'}`)
  //   } finally {
  //     // setTimeout(() => { pendingMap.current.set(type, false) }, 0) // 控制阀门状态在下次event loop恢复
  //   }
  // }, [handlers])
}
