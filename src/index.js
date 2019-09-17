/**
 * @desc store
 */

import React, {
  useReducer,
  createContext,
  useContext,
} from 'react'
import Immutable from 'immutable'
import reducer from './reducer'
import useMiddleware from './uses/useMiddleWare'

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
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
} from './utils/constants'

// 导出的
export const create = ({ initialState, middlewares }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)
  const Provider = ({ children }) => {
    const [
      state,
      dispatch,
    ] = useReducer(reducer, Immutable.fromJS(initialState))
    const enhancedDispatch = useMiddleware({ dispatch, middlewares })
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

export const COMMON_TYPE = Object.freeze({
  MERGE,
  DELETE,
  UPDATE,
  CLEAR,
  INSERT,
  PUSH,
  POP,
  SHIFT,
  UNSHIFT,
})

export const COMMON_CONFIG = Object.freeze({
  DEBOUNCE,
  THROTTLE,
  DELAY,
  PEND,
})

