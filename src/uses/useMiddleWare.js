/**
 * @desc 使用middleware增强dispatch
 */

import { useMemo, useRef } from 'react'
import { error, warn, log } from '../utils/log'
import * as tj from '../utils/typeJudgement'
import {
  PEND,
  DELAY,
  THROTTLE,
  DEBOUNCE,
  REVERT,
  _SAVE_CURRENT_STATE_,
} from '../utils/constants'

export default function useMiddleware({
  dispatch,
  middlewares,
}) {
  const pendingMap = useRef(new Map()) // 记录挂起状态 （Boolean）
  const throttleMap = useRef(new Map()) // 记录节流状态（Boolean）
  const debounceMap = useRef(new Map()) // 记录防抖状态（Timer）

  // 通过中间件扩展dispatch
  const enhanced = useMemo(() => {
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
      return dispatch
    }

    return [...middlewares, dispatch].reverse().reduce((next, curr) => (
      curr(
        dispatch,
        async (...args) => {
          await next(...args)
        },
      )
    ))
  }, [dispatch, middlewares])

  // 增加挂起、防抖和节流
  return useMemo(() => {
    return async action => {
      const { type, config } = action

      // 判断被之前同type的action挂起的阻止
      if (pendingMap.current.get(type)) {
        log(`"${String(type)}" action is rejected because a previous (pending) action isn't done`)
        return
      }

      // 判断被之前同type的action节流的阻止
      if (throttleMap.current.get(type)) {
        log(`"${String(type)}" action is rejected because a previous (throttle) action isn't done`)
        return
      }

      // 根据config设置 等待、挂起、防抖的设置
      if (config) {
        const configDelay = Number(config[DELAY])
        const configPend = Boolean(config[PEND])
        const configDebounce = Number(config[DEBOUNCE])
        const configThrottle = Number(config[THROTTLE])

        // delay
        if (configDelay > 0) {
          await new Promise(resolve => setTimeout(() => resolve(), configDelay))
        }

        // pend
        if (configPend) {
          pendingMap.current.set(type, true)
        }

        if (configDebounce > 0) {
          const currentDebounceId = (debounceMap.current.get(type) || 0) + 1
          debounceMap.current.set(type, currentDebounceId)
          const nextDebounceId = await new Promise(res => {
            setTimeout(() => res(debounceMap.current.get(type)), configDebounce)
          })
          if (nextDebounceId !== currentDebounceId) {
            log(`"${String(type)}-${currentDebounceId}" action was cleared by next "${String(type)}-${nextDebounceId}" action`)
            return
          }
        }

        // throttle
        if (configThrottle > 0) {
          throttleMap.current.set(type, true)
          setTimeout(() => throttleMap.current.set(type, false), configThrottle)
        }
      }

      try {
        if (type === REVERT) {
          // revert操作不触发state的记录
          dispatch({ type })
        } else {
          dispatch({ type: _SAVE_CURRENT_STATE_ })
          await enhanced(action)
        }
      } catch (e) {
        error(e)
      } finally {
        pendingMap.current.set(type, false)
      }
    }
  }, [dispatch, enhanced])
}
