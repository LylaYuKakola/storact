import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG, COMMON_TYPE } from '../../src'
import { useDispatch, useStore, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const store = useStore()

  const handleClick = useCallback(() => {
    const currentTimes = store.get('times')
    dispatch[COMMON_TYPE.PUSH]({
      keys: ['dates'],
      data: 123123123,
    })
    dispatch[COMMON_TYPE.UPDATE]({
      keys: ['times'],
      data: currentTimes + 1,
    })
  }, [dispatch, store])

  const handleClear = useCallback(() => {
    dispatch[COMMON_TYPE.CLEAR]({ keys: ['dates'] })
    dispatch[COMMON_TYPE.CLEAR]({ keys: ['times'] })
  }, [dispatch])

  const handleClickGetTime = useCallback(() => {
    dispatch.getTime()
  }, [dispatch])

  const handleClickGetTimeDelay = useCallback(() => {
    dispatch.getTime({},  { [COMMON_CONFIG.DELAY]: 1000 })
  }, [dispatch])

  const handleClickGetTimeDebounce = useCallback(() => {
    dispatch.getTime({},  { [COMMON_CONFIG.DEBOUNCE]: 1000 })
  }, [dispatch])

  const handleClickGetTimeThrottle = useCallback(() => {
    dispatch.getTime({},  { [COMMON_CONFIG.THROTTLE]: 1000 })
  }, [dispatch])

  const handleClickGetTimePend = useCallback(() => {
    dispatch.getTime({},  { [COMMON_CONFIG.PEND]: 1000 })
  }, [dispatch])

  // useEffect(() => {
  //   debugger
  // }, [store])

  return (
    <div>
      <div onClick={handleClick}>click</div><br />
      {/* <div onClick={handleRevert}>revert</div><br /> */}
      {/* <div onClick={handleRevertWithOthers}>revertWithOthers</div><br /> */}
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
