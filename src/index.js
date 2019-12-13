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
let runningAction = null
let activeAction = null


// 导出的
export const create = ({ initialState, middlewares, effects, namespace }) => {
  const storeContext = createContext(null)
  const dispatchContext = createContext(null)

  const fixedNamespace = namespace || guid()

  const firstMiddleWare = ({ getState }) => next => async action => {
    await next(action)
    const fixedAction = {
      ...action,
      type: String(action.type),
    }
    runningAction = fixedAction
    __STORACT_STATE_[fixedNamespace].push([fixedAction, immutable.fromJS(getState() || {}).toJS()])
    window.postMessage({
      type: '__STORACT_STATE_',
      data: __STORACT_STATE_,
    }, '*')
  }

  const Provider = ({ children }) => {
    const currentState = useRef(null)
    const [state, originalDispatch] = useAsyncReducer(reducer, initialize(initialState))
    const getState = useCallback(() => currentState.current, [])
    const enhancedDispatch = useEnhanced({
      originalDispatch,
      getState,
      middlewares: [...(middlewares || []), firstMiddleWare],
      effects,
    })

    useEffect(() => {
      __STORACT_STATE_[fixedNamespace] = []
      __STORACT_STATE_[fixedNamespace].push(['initial', immutable.fromJS(state || {}).toJS()])
      setTimeout(() => {
        window.postMessage({
          type: '__STORACT_STATE_',
          data: __STORACT_STATE_,
        }, '*')
      }, 500)
      return () => {
        Reflect.deleteProperty(__STORACT_STATE_, fixedNamespace)
        window.postMessage({
          type: '__STORACT_STATE_',
          data: __STORACT_STATE_,
        }, '*')
      }
    }, [])

    useEffect(() => {
      currentState.current = state
      if (!runningAction) return
      if (runningAction !== activeAction) {
        __STORACT_STATE_[fixedNamespace].push([runningAction, immutable.fromJS(currentState.current || {}).toJS()])
        activeAction = runningAction
      } else {
        __STORACT_STATE_[fixedNamespace].pop()
        __STORACT_STATE_[fixedNamespace].push([runningAction, immutable.fromJS(currentState.current || {}).toJS()])
      }
      window.postMessage({
        type: '__STORACT_STATE_',
        data: __STORACT_STATE_,
      }, '*')
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

