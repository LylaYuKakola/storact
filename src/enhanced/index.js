/**
 * @desc 增强dispatch，挂载middleware，增加action的batch
 */

import { useMemo, useRef } from 'react'
import { error, log, warn } from '../utils/log'
import * as tj from '../utils/typeJudgement'
import getFunctionalActions from '../utils/getFunctionalActions'
import { DEBOUNCE, DELAY, PEND, THROTTLE } from '../utils/constants'

export default function useEnhanced({
  originalDispatch,
  getState,
  middlewares,
  effects,
}) {
  const pendingMap = useRef(new Map()) // 记录挂起状态 （Boolean）
  const throttleMap = useRef(new Map()) // 记录节流状态（Boolean）
  const debounceMap = useRef(new Map()) // 记录防抖状态（Timer）

  // 挂载effects
  const enhancedStep1 = useMemo(() => {
    const effectKeys = Object.keys(effects)
    const effectActiveDispatch = new Proxy(Object.create(null), {
      get: (_t, key) => async (...args) => {
        if (effectKeys.includes(key)) {
          await effects[key]({
            getState,
            dispatch: effectActiveDispatch,
          })(args)
        } else {
          await originalDispatch({
            type: key,
            payload: args[0],
            config: args[1],
          })
        }
      },
    })
    return async action => {
      const { type, payload, config } = action
      await effectActiveDispatch[type](payload, config)
    }
  }, [getState, originalDispatch, effects])

  // 挂载中间件
  const enhancedStep2 = useMemo(() => {
    if (
      !middlewares ||
      !(middlewares instanceof Array) ||
      !middlewares.length ||
      middlewares.some(m => !(tj.isFunction(m)))
    ) {
      return enhancedStep1
    }
    if (!(middlewares instanceof Array)) {
      warn(`"middlewares" should be an array, but get a ${typeof middlewares}`)
      return enhancedStep1
    }
    if (!middlewares.length) {
      warn('"middlewares" is an empty array')
      return enhancedStep1
    }
    if (middlewares.some(m => !(tj.isFunction(m)))) {
      warn(`"middlewares" includes an item which is not a function`)
      return enhancedStep1
    }

    return [...middlewares, enhancedStep1].reverse().reduce((next, curr) => {
      return curr({
        getState,
        dispatch: getFunctionalActions(enhancedStep1),
      })(next)
    })
  }, [getState, enhancedStep1, middlewares])

  // 增加挂起、防抖和节流
  const enhancedStep3 = useMemo(() => {
    return async action => {
      const { type, config } = action

      if (!type) return

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
        await enhancedStep2(action)
      } catch (e) {
        error(e)
      } finally {
        pendingMap.current.set(type, false)
      }
    }
  }, [enhancedStep2])

  return useMemo(() => {
    return getFunctionalActions(enhancedStep3)
  }, [enhancedStep3])
}
