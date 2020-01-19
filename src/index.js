/**
 * @desc store
 */

import React, {
  createContext,
  useContext,
  useCallback,
} from 'react'
import { List, Map } from 'immutable'
import initialize from './initialize'
import reducer from './reducer'
import useEnhanced from './enhanced'
import useAsyncReducer from './uses/useAsyncReducer'
import {
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
} from './utils/constants'

// 导出的
export const create = ({ initialState, middlewares, effects }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)

  // 核心根容器
  const Provider = ({ children }) => {
    const [state, originalDispatch] = useAsyncReducer(reducer, initialize(initialState))

    // 获取当前的state状态
    const getState = useCallback((...args) => {
      if (args.length === 0) return state.toJS()
      const target = state.getIn(args)
      if (List.isList(target) || Map.isMap(target)) return target.toJS()
      return target
    }, [state])

    const enhancedDispatch = useEnhanced({
      originalDispatch,
      getState,
      middlewares,
      effects,
    })

    return (
      <dispatchContext.Provider value={enhancedDispatch}>
        <storeContext.Provider value={getState}>
          {children}
        </storeContext.Provider>
      </dispatchContext.Provider>
    )
  }

  const useDispatcher = () => useContext(dispatchContext)
  const useGetter = () => useContext(storeContext)

  return { useDispatcher, useGetter, Provider }
}

export const COMMON_CONFIG = Object.freeze({
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
})

