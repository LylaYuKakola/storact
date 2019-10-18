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

  const Provider = ({ children }) => {
    const currentState = useRef(null)
    const [state, originalDispatch] = useAsyncReducer(reducer, initialize(initialState))
    const getState = useCallback(() => currentState.current, [])
    const enhancedDispatch = useEnhanced({ originalDispatch, getState, middlewares, effects })

    useEffect(() => {
      currentState.current = state
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

