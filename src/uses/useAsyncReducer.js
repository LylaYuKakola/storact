/**
 * @desc 异步的reducer，返回 state 和 async_dispatch
 */

import { useRef, useReducer, useMemo, useEffect, useCallback } from 'react'

const __ALL_DONE_DISPATCH_TIMES__ = Symbol('allDoneDispatchTimes(Not accessible!!!)')
const __STATE__ = Symbol('actual state!!!')
const INITIAL_TIMES = 0

export default function useAsyncReducer(reducer, initialState) {
  const resolve = useRef(null)
  const times = useRef(INITIAL_TIMES)

  const newReducer = useCallback((state, action) => {
    const prevActualState = Reflect.get(state, __STATE__)
    const prevDispatchTimes = Reflect.get(state, __ALL_DONE_DISPATCH_TIMES__)
    const newActualState = reducer(prevActualState, action)
    return {
      [__STATE__]: newActualState,
      [__ALL_DONE_DISPATCH_TIMES__]: prevDispatchTimes + 1,
    }
  }, [reducer])

  const [state, _dispatch] = useReducer(newReducer, {
    [__STATE__]: initialState,
    [__ALL_DONE_DISPATCH_TIMES__]: INITIAL_TIMES,
  })

  const dispatch = useMemo(() => async action => {
    _dispatch(action)
    await new Promise(res => {
      resolve.current = res
    })
  }, [_dispatch])

  useEffect(() => {
    const nextTimes = state[__ALL_DONE_DISPATCH_TIMES__]
    if (times.current < nextTimes) {
      times.current = nextTimes
      resolve.current()
    }
  }, [state[__ALL_DONE_DISPATCH_TIMES__]])

  return [state[__STATE__], dispatch]
}
