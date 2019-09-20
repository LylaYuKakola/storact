import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG, COMMON_TYPE } from '../../src'
import { useDispatch, useStore, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const store = useStore()

  const handleClick = useCallback(() => {
    const currentTimes = store.get('times') || 0
    dispatch([
      { type: COMMON_TYPE.PUSH, payload: { keys: ['dates'], data: Date.now() } },
      { type: COMMON_TYPE.UPDATE, payload: { keys: ['times'], data: currentTimes + 1 } },
    ])
  }, [dispatch, store])

  const handleRevert = useCallback(() => {
    dispatch({ type: COMMON_TYPE.REVERT })
  }, [dispatch, store])

  const handleRevertWithOthers = useCallback(() => {
    dispatch([
      { type: COMMON_TYPE.REVERT },
      { type: COMMON_TYPE.CLEAR, payload: { keys: ['times'] } },
    ])
  }, [dispatch, store])

  const handleClear = useCallback(() => {
    dispatch([
      { type: COMMON_TYPE.CLEAR, payload: { keys: ['dates'] } },
      { type: COMMON_TYPE.CLEAR, payload: { keys: ['times'] } },
    ])
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
      <div onClick={handleClick}>click</div><br />
      <div onClick={handleRevert}>revert</div><br />
      <div onClick={handleRevertWithOthers}>revertWithOthers</div><br />
      <div onClick={handleClear}>clear</div><br />
      <div onClick={handleClickGetTime}>getTime</div><br />
      <div onClick={handleClickGetTimeDelay}>getTime_Delay</div><br />
      <div onClick={handleClickGetTimeDebounce}>getTime_Debounce</div><br />
      <div onClick={handleClickGetTimeThrottle}>getTime_Throttle</div><br />
      <div onClick={handleClickGetTimePend}>getTime_Pend</div><br />
      <div>times: {String(store.get('times'))}</div><br />
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
