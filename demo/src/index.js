import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG, COMMON_TYPE } from '../../src'
import { useDispatch, useStore, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const store = useStore()

  const handleClick = useCallback(() => {
    dispatch({ type: 'click' })
  }, [dispatch, store])

  const handleRevert = useCallback(() => {
    dispatch({ type: COMMON_TYPE.REVERT })
  }, [dispatch, store])

  const handleClear = useCallback(() => {
    dispatch({ type: COMMON_TYPE.CLEAR, payload: { keys: ['dates'] } })
    dispatch({ type: COMMON_TYPE.CLEAR, payload: { keys: ['times'] } })
  }, [dispatch])

  const handleClickGetTime = useCallback(() => {
    dispatch({ type: 'getTime' })
  }, [dispatch])

  const handleClickGetTimeDelay = useCallback(() => {
    dispatch({
      type: 'getTime',
      config: { [COMMON_CONFIG.DELAY]: 1000 },
    })
  }, [dispatch])

  const handleClickGetTimeDebounce = useCallback(() => {
    dispatch({
      type: 'getTime',
      config: { [COMMON_CONFIG.DEBOUNCE]: 1000 },
    })
  }, [dispatch])

  const handleClickGetTimeThrottle = useCallback(() => {
    dispatch({
      type: 'getTime',
      config: { [COMMON_CONFIG.THROTTLE]: 1000 },
    })
  }, [dispatch])

  const handleClickGetTimePend = useCallback(() => {
    dispatch({
      type: 'getTime',
      config: { [COMMON_CONFIG.PEND]: true },
    })
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
      <div onClick={handleClickGetTimeDelay}>getTime_Delay</div>
      <div onClick={handleClickGetTimeDebounce}>getTime_Debounce</div>
      <div onClick={handleClickGetTimeThrottle}>getTime_Throttle</div>
      <div onClick={handleClickGetTimePend}>getTime_Pend</div>
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
