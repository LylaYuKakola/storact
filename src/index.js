/**
 * @desc store
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { List, Map } from 'immutable'
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


// 导出的
export const create = ({ initialState, middlewares, effects, namespace }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)
  const fixedInitialize = initialize(initialState)

  // 如果没有指定 'namespace'，就默认为 'Global'
  const fixedNamespace = namespace || `Global-${guid()}`

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
  const lastMiddleWare = ({ getState }) => next => async action => {
    await next(action)
    const fixedAction = {
      ...action,
      type: String(action.type),
    }
    window.postMessage({
      type: '_ADD_STATE_',
      data: [fixedNamespace, fixedAction, getState()],
    }, '*')
  }

  // 核心根容器
  const Provider = ({ children }) => {
    const [state, originalDispatch] = useAsyncReducer(reducer, fixedInitialize)
    const currentState = useRef(fixedInitialize)
    currentState.current = state

    // 获取当前的state状态
    // 这是一个不会变化的方法，每次调用都会拿到最新的state，
    // 使用在middleware 和 effect 中，为了更准确的拿到当前的状态
    const getState = useCallback((path = []) => {
      if (!currentState.current) return null
      if (path.length === 0) return currentState.current.toJS()
      const target = currentState.current.getIn(path)
      if (List.isList(target) || Map.isMap(target)) return target.toJS()
      return target
    }, [])

    // 获取当前的state状态
    // 这个方法是随着state的变化而变的
    // 用在具体的组件里
    const stateGetterForComponent = useCallback((path = []) => {
      const target = useMemo(() => {
        return state.getIn(path)
      }, [state, path])
      return useMemo(() => {
        if (List.isList(target) || Map.isMap(target)) return target.toJS()
        return target
      }, [target])
    }, [state])

    const enhancedDispatch = useEnhanced({
      originalDispatch,
      getState,
      middlewares: [...middlewares, lastMiddleWare],
      effects,
    })

    useEffect(() => {
      // 这里需要绕到下次时间循环的时候执行 'initial'
      setTimeout(() => {
        window.postMessage({
          type: '_ADD_STATE_',
          data: [fixedNamespace, 'INITIAL_STATE', currentState.current.toJS()],
        }, '*')
      }, 500)

      // 页面关闭时，卸载当前的 fixedNamespace
      window.addEventListener('beforeunload', deleteCurrentNamespace)
      return () => {
        deleteCurrentNamespace()
        currentState.current = null
      }
    }, [])

    return (
      <dispatchContext.Provider value={enhancedDispatch}>
        <storeContext.Provider value={stateGetterForComponent}>
          {children}
        </storeContext.Provider>
      </dispatchContext.Provider>
    )
  }

  const useDispatch = () => useContext(dispatchContext)
  const useGetState = path => useContext(storeContext)(path)

  return { useDispatch, useGetState, Provider }
}

export const COMMON_CONFIG = Object.freeze({
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
})

