/**
 * @desc store
 */

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import immutable from 'immutable'
import initialize from './initialize'
import reducer from './reducer'
import useEnhanced from './enhanced'
import useAsyncReducer from './uses/useAsyncReducer'
import guid from './utils/guid'
import {
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
} from './utils/constants'

let runningActionIndex = 0
let lastActionIndex = 0


// 导出的
export const create = ({ initialState, middlewares, effects, namespace }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)

  // 如果没有指定 'namespace'，就默认为 'Global'
  const fixedNamespace = namespace || `Global-${guid()}`

  // 第一个中间件，用来记录一个action执行的开始
  const firstMiddleware = () => next => async action => {
    runningActionIndex += 1
    await next(action)
  }

  // 卸载 fixedNamespace 操作
  const deleteCurrentNamespace = () => {
    window.postMessage({
      type: '_DELETE_NAMESPACE_',
      data: fixedNamespace,
    }, '*')
    window.removeEventListener('beforeunload', deleteCurrentNamespace)
    return 'delete NAMESPACE'
  }

  // 最后一个中间件，用来记录一个action执行的结束
  // 这里的'结束'是执行结束，但此时页面并未同步，而且如果里边包含异步的话，也会存在异步的回调未执行
  // 所以这里'结束'时的state并非这个action执行完的最终结果
  const lastMiddleWare = ({ getState }) => next => async action => {
    await next(action)
    const fixedAction = {
      ...action,
      type: String(action.type),
    }
    lastActionIndex += 1
    window.postMessage({
      type: '_ADD_STATE_',
      data: [fixedNamespace, fixedAction, immutable.fromJS(getState() || {}).toJS()],
    }, '*')
  }

  // 核心根容器
  const Provider = ({ children }) => {
    const currentState = useRef(null)
    const [state, originalDispatch] = useAsyncReducer(reducer, initialize(initialState))
    const getState = useCallback(() => currentState.current, [])
    const enhancedDispatch = useEnhanced({
      originalDispatch,
      getState,
      middlewares: [firstMiddleware, ...(middlewares || []), lastMiddleWare],
      effects,
    })

    useEffect(() => {
      // 这里需要绕到下次时间循环的时候执行 'initial'
      setTimeout(() => {
        window.postMessage({
          type: '_ADD_STATE_',
          data: [fixedNamespace, 'INITIAL_STATE', immutable.fromJS(state || {}).toJS()],
        }, '*')
      }, 500)

      // 页面关闭时，卸载当前的 fixedNamespace
      window.addEventListener('beforeunload', deleteCurrentNamespace)

      // 组件卸载时，卸载当前的 fixedNamespace
      return () => {
        deleteCurrentNamespace()
      }
    }, [])

    // 监听state的变化
    useEffect(() => {
      currentState.current = state
      if (!currentState.current) return
      if (!lastActionIndex) return
      if (lastActionIndex === runningActionIndex) {
        window.postMessage({
          type: '_CHANGE_STATE_',
          data: [fixedNamespace, immutable.fromJS(currentState.current || {}).toJS()],
        }, '*')
      }
    }, [state])

    return (
      <dispatchContext.Provider value={enhancedDispatch}>
        <storeContext.Provider value={state}>
          {children}
        </storeContext.Provider>
      </dispatchContext.Provider>
    )
  }

  const useDispatch = () => useContext(dispatchContext)
  const useStore = () => useContext(storeContext)

  return { useDispatch, useStore, Provider }
}

export const COMMON_CONFIG = Object.freeze({
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
})

