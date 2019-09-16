import React, { useCallback, useEffect } from 'react'
import { render } from 'react-dom'
import { COMMON_TYPE } from '../../src'
import { CLICK, REVERT, TIME } from '../config/middlewares'
import { useDispatch, useStore, Provider } from '../config/myStore'

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
  }, [dispatch])

  const handleClickGetTime = useCallback(() => {
    dispatch({ type: TIME })
  }, [dispatch])

  // useEffect(() => {
  //   debugger
  // }, [store])

  return (
    <div>
      <div onClick={handleClick}>click</div>
      <div onClick={handleRevert}>revert</div>
      <div onClick={handleClear}>clear</div>
      <div onClick={handleClickGetTime}>getTime</div>
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
