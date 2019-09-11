import React, { useCallback } from 'react'
import { render } from 'react-dom'

import store, { COMMON_TYPE } from '../../src'

const CLICK = Symbol('click')
const REVERT = Symbol('revert')

const initialState = {
  times: null,
  dates: [],
}

const middleware = dispatch => ({
  [CLICK]: () => {
    dispatch({
      type: COMMON_TYPE.PUSH,
      payload: {
        keys: ['dates'],
        data: Date.now(),
      },
    })
  },
  [REVERT]: () => {
    dispatch({
      type: COMMON_TYPE.POP,
      payload: {
        keys: ['dates'],
      },
    })
  },
})

const {
  useDispatch,
  useStore,
  Provider,
} = store({ initialState, middleware })

function IndexPage() {
  const dispatch = useDispatch()
  const store = useStore()

  const handleClick = useCallback(() => {
    dispatch({ type: CLICK })
    const times = store.get('times')
    dispatch({ type: COMMON_TYPE.UPDATE, payload: { keys: ['times'], data: Number(times) + 1 } })
  }, [dispatch, store])

  const handleRevert = useCallback(() => {
    dispatch({ type: REVERT })
    const times = store.get('times')
    dispatch({ type: COMMON_TYPE.UPDATE, payload: { keys: ['times'], data: Number(times) - 1 } })
  }, [dispatch, store])

  const handleClear = useCallback(() => {
    dispatch({ type: COMMON_TYPE.CLEAR, payload: { keys: ['dates'] } })
    dispatch({ type: COMMON_TYPE.CLEAR, payload: { keys: ['times'] } })
  }, [dispatch, store])

  return (
    <div>
      <div onClick={handleClick}>click</div>
      <div onClick={handleRevert}>revert</div>
      <div onClick={handleClear}>clear</div>
      <div>times: {store.get('times')}</div>
      <div>
        {
          store.get('dates').toJS().map(date => (
            <p>{date}</p>
          ))
        }
      </div>
    </div>
  )
}

render(<Provider><IndexPage /></Provider>, document.querySelector('#demo'))
