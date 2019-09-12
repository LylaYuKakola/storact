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
} from './utils/constants'

// 导出的
const storact = ({ initialState, middleware }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)
  const Provider = ({ children }) => {
    const [
      state,
      dispatch,
    ] = useReducer(reducer, Immutable.fromJS(initialState))
    const enhancedDispatch = useMiddleware({ dispatch, middleware })
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

export default storact
