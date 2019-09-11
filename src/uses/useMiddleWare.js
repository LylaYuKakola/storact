/**
 * @desc 使用middleware增强dispatch
 */

import { useRef, useMemo } from 'react'
import { error } from '../utils/log'
import * as tj from '../utils/typeJudgement'

const emptyObject = Object.create(null)

export default function useMiddleware({
  dispatch,
  middleware,
}) {
  // 获取中间件的handler对象
  const handlers = useMemo(() => {
    if (!middleware) return emptyObject
    if (!(tj.isFunction(middleware))) {
      error('wrong to load "middleware": expected a function')
      return emptyObject
    }
    return middleware.call(null, dispatch) || {}
  }, [middleware, dispatch])

  // 因为中间件多为异步操作，
  // 所以需要设置一个阀门，控制同一类型的中间操作不能同时执行两个
  // 这样不会出现对store的修改冲突
  // @TODO 暂时去掉阀门
  // const pendingMap = useRef(new Map())

  return useMemo(() => async action => {
    const { type, payload } = action
    // const pendingState = pendingMap.current.get(type)
    // if (pendingState) return
    // pendingMap.current.set(type, true)
    try {
      const handler = handlers[type]
      if (handler) {
        await handler(payload)
      } else {
        dispatch(action)
      }
    } catch (error) {
      error(`${error.name || 'Unexpected error!'}`)
    } finally {
      // setTimeout(() => { pendingMap.current.set(type, false) }, 0) // 控制阀门状态在下次event loop恢复
    }
  }, [handlers])
}
