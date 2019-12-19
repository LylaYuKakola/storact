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

let runningActionIndex = 0
let lastActionIndex = 0


// 导出的
export const create = ({ initialState, middlewares, effects, namespace }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)

  const fixedNamespace = namespace || guid()

  const firstMiddleware = () => next => async action => {
    runningActionIndex += 1
    await next(action)
  }

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
      setTimeout(() => {
        window.postMessage({
          type: '_ADD_STATE_',
          data: [fixedNamespace, 'INITIAL_STATE', immutable.fromJS(state || {}).toJS()],
        }, '*')
      }, 500)
      return () => {
        window.postMessage({
          type: '_DELETE_NAMESPACE_',
          data: fixedNamespace,
        }, '*')
      }
    }, [])

    useEffect(() => {
      currentState.current = state
      if (!lastActionIndex) return
      if (lastActionIndex === runningActionIndex) {
        window.postMessage({
          type: '_CHANGE_STATE_',
          data: [fixedNamespace, immutable.fromJS(getState() || {}).toJS()],
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

