import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG, COMMON_TYPE } from '../../src'
import { useDispatch, useStore, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const store = useStore()

  const handleClick = useCallback(() => {
    dispatch.click(1, 2)
  }, [dispatch, store])

  const handleClickTwice = useCallback(() => {
    dispatch.clickTwice()
  }, [dispatch])

  const handleClear = useCallback(() => {
    dispatch[COMMON_TYPE.CLEAR]({ keys: ['dates'] })
    dispatch[COMMON_TYPE.CLEAR]({ keys: ['times'] })
  }, [dispatch])

  const handleClickGetTime = useCallback(() => {
    dispatch.markCurrentTime()
  }, [dispatch])

  const handleClickGetTimeDelay = useCallback(() => {
    dispatch.markCurrentTime({}, { [COMMON_CONFIG.DELAY]: 1000 })
  }, [dispatch])

  const handleClickGetTimeDebounce = useCallback(() => {
    dispatch.markCurrentTime({}, { [COMMON_CONFIG.DEBOUNCE]: 1000 })
  }, [dispatch])

  const handleClickGetTimeThrottle = useCallback(() => {
    dispatch.markCurrentTime({}, { [COMMON_CONFIG.THROTTLE]: 1000 })
  }, [dispatch])

  const handleClickGetTimePend = useCallback(() => {
    dispatch.markCurrentTime({}, { [COMMON_CONFIG.PEND]: 1000 })
  }, [dispatch])

  // useEffect(() => {
  //   debugger
  // }, [store])

  return (
    <div>
      <button onClick={handleClick}>click</button><br />
      <button onClick={handleClickTwice}>Twice</button><br />
      {/* <div onClick={handleRevert}>revert</div><br /> */}
      {/* <div onClick={handleRevertWithOthers}>revertWithOthers</div><br /> */}
      <button onClick={handleClear}>clear</button><br />
      <button onClick={handleClickGetTime}>getTime</button><br />
      <button onClick={handleClickGetTimeDelay}>getTime_Delay</button><br />
      <button onClick={handleClickGetTimeDebounce}>getTime_Debounce</button><br />
      <button onClick={handleClickGetTimeThrottle}>getTime_Throttle</button><br />
      <button onClick={handleClickGetTimePend}>getTime_Pend</button><br />
      <p>times: {String(store.get('times'))}</p><br />
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
