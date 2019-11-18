import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG } from '../../src'
import { useDispatch, useStore, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const store = useStore()

  const handleClickWithoutParams = useCallback(() => {
    dispatch.click()
  }, [dispatch])

  const handleClickWithParams = useCallback(() => {
    dispatch.click(1, 2)
  }, [dispatch])

  const handleClickTwice = useCallback(() => {
    dispatch.clickTwice()
  }, [dispatch])

  const handleClear = useCallback(() => {
    dispatch.clear(['dates'])
    dispatch.clear(['times'])
  }, [dispatch])

  const handleClickGetTime = useCallback(() => {
    dispatch.markCurrentTime()
  }, [dispatch])

  const handleClickGetTimeDelay = useCallback(() => {
    const dispatchWithDelay = dispatch.config({ [COMMON_CONFIG.DELAY]: 2000 })
    dispatchWithDelay.markCurrentTime()
  }, [])

  const handleClickGetTimeDebounce = useCallback(() => {
    const dispatchWithDebounce = dispatch.config({ [COMMON_CONFIG.DEBOUNCE]: 2000 })
    dispatchWithDebounce.markCurrentTime()
  }, [dispatch])

  const handleClickGetTimeThrottle = useCallback(() => {
    const dispatchWithThrottle = dispatch.config({ [COMMON_CONFIG.THROTTLE]: 2000 })
    dispatchWithThrottle.markCurrentTime()
  }, [dispatch])

  const handleClickGetTimePend = useCallback(() => {
    const dispatchWithPend = dispatch.config({ [COMMON_CONFIG.PEND]: 2000 })
    dispatchWithPend.markCurrentTime()
  }, [dispatch])

  // useEffect(() => {
  //   debugger
  // }, [store])

  return (
    <div>
      <button onClick={handleClickWithoutParams}>click to plus one</button><br />
      <button onClick={handleClickWithParams}>click to plus three</button><br />
      <button onClick={handleClickTwice}>Twice</button><br />
      <button onClick={handleClear}>clear</button><br />
      <button onClick={handleClickGetTime}>getTime</button><br />
      <button onClick={handleClickGetTimeDelay}>getTime_Delay</button><br />
      <button onClick={handleClickGetTimeDebounce}>getTime_Debounce</button><br />
      <button onClick={handleClickGetTimeThrottle}>getTime_Throttle</button><br />
      <button onClick={handleClickGetTimePend}>getTime_Pend</button><br />
      <p>times: {String(store.get('times'))}</p><br />
      <ol style={{ width: 300, height: 300, overflow: 'auto', border: '1px solid red' }}>
        {
          store.get('dates').toJS().map(date => (
            <li>{date}</li>
          ))
        }
      </ol>
    </div>
  )
}

render(<Provider><IndexPage /></Provider>, document.querySelector('#demo'))
