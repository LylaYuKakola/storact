import React, { useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG } from '../../src'
import { useDispatcher, useGetter, Provider } from './myStore'

function IndexPage() {
  const dispatcher = useDispatcher()
  const getter = useGetter()

  const handleClickWithoutParams = useCallback(() => {
    dispatcher.click()
  }, [dispatcher])

  const handleClickWithParams = useCallback(() => {
    dispatcher.click(1, 2)
  }, [dispatcher])

  const handleClickTwice = useCallback(() => {
    dispatcher.clickTwice()
  }, [dispatcher])

  const handleClear = useCallback(() => {
    dispatcher.clear(['dates'])
    dispatcher.clear(['times'])
  }, [dispatcher])

  const handleClickGetTime = useCallback(() => {
    dispatcher.markCurrentTime()
  }, [dispatcher])

  const handleClickGetTimeDelay = useCallback(() => {
    const dispatchWithDelay = dispatcher.config({ [COMMON_CONFIG.DELAY]: 2000 })
    dispatchWithDelay.markCurrentTime()
  }, [])

  const handleClickGetTimeDebounce = useCallback(() => {
    const dispatchWithDebounce = dispatcher.config({ [COMMON_CONFIG.DEBOUNCE]: 2000 })
    dispatchWithDebounce.markCurrentTime()
  }, [dispatcher])

  const handleClickGetTimeThrottle = useCallback(() => {
    const dispatchWithThrottle = dispatcher.config({ [COMMON_CONFIG.THROTTLE]: 2000 })
    dispatchWithThrottle.markCurrentTime()
  }, [dispatcher])

  const handleClickGetTimePend = useCallback(() => {
    const dispatchWithPend = dispatcher.config({ [COMMON_CONFIG.PEND]: 2000 })
    dispatchWithPend.markCurrentTime()
  }, [dispatcher])

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
      <p>times: {getter('times')}</p><br />
      <ol style={{ width: 300, height: 300, overflow: 'auto', border: '1px solid red' }}>
        {
          getter('dates').map(date => (
            <li>{date}</li>
          ))
        }
      </ol>
    </div>
  )
}

render(<Provider><IndexPage /></Provider>, document.querySelector('#demo'))
