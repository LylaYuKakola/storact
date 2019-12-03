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
import guid from './utils/guid'
import useAsyncReducer from './uses/useAsyncReducer'
import {
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
} from './utils/constants'

const __STORACT_STATE_ = {}

// 导出的
export const create = ({ initialState, middlewares, effects, namespace }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)

  const Provider = ({ children }) => {
    const currentState = useRef(null)
    const [state, originalDispatch] = useAsyncReducer(reducer, initialize(initialState))
    const getState = useCallback(() => currentState.current, [])
    const enhancedDispatch = useEnhanced({ originalDispatch, getState, middlewares, effects })

    useEffect(() => {
      if (window) {
        __STORACT_STATE_[namespace || guid()] = immutable.fromJS(state || {}).toJS()
        window.postMessage({
          type: '__STORACT_STATE_',
          data: __STORACT_STATE_,
        }, '*')
      }
      currentState.current = state
    }, [state, namespace])

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

