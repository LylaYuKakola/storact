import React, { useState, useCallback } from 'react'
import { render } from 'react-dom'
import { COMMON_CONFIG } from '../../src'
import { useDispatch, useGetState, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState()
  const timesInStore = useGetState(['msg', 'times']) || 0
  const asyncInStore = useGetState(['msg', 'async']) || 0
  const syncInStore = useGetState(['msg', 'sync']) || 0
  const dateListInStore = useGetState(['dates']) || []

  const handleInsertAsLast = useCallback(() => {
    dispatch.insertAsLast()
  }, [dispatch])

  const handleInsertTwiceAsLast = useCallback(() => {
    dispatch.insertTwiceAsLast()
  }, [dispatch])

  const handleInsertAsFirst = useCallback(() => {
    dispatch.insertAsFirst()
  }, [dispatch])

  const handleInsertTwiceAsFirst = useCallback(() => {
    dispatch.insertTwiceAsFirst()
  }, [dispatch])

  const handleDeleteFirst = useCallback(() => {
    dispatch.deleteFirst()
  }, [dispatch])

  const handleDeleteLast = useCallback(() => {
    dispatch.deleteLast()
  }, [dispatch])

  const handleClear = useCallback(() => {
    dispatch.clear(['dates'])
    dispatch.update(['msg'], { async: 0, sync: 0, times: 0 })
  }, [dispatch])

  const handleClickGetTime = useCallback(() => {
    dispatch.markCurrentTimeAsync()
  }, [dispatch])

  const handleClickGetTimeDelay = useCallback(() => {
    const dispatchWithDelay = dispatch.config({ [COMMON_CONFIG.DELAY]: 2000 })
    dispatchWithDelay.markCurrentTimeAsync()
  }, [])

  const handleClickGetTimeDebounce = useCallback(() => {
    const dispatchWithDebounce = dispatch.config({ [COMMON_CONFIG.DEBOUNCE]: 2000 })
    dispatchWithDebounce.markCurrentTimeAsync()
  }, [dispatch])

  const handleClickGetTimeThrottle = useCallback(() => {
    const dispatchWithThrottle = dispatch.config({ [COMMON_CONFIG.THROTTLE]: 2000 })
    dispatchWithThrottle.markCurrentTimeAsync()
  }, [dispatch])

  const handleClickGetTimePend = useCallback(() => {
    const dispatchWithPend = dispatch.config({ [COMMON_CONFIG.PEND]: 2000 })
    dispatchWithPend.markCurrentTimeAsync()
  }, [dispatch])

  const handleInsertWithParam = useCallback(() => {
    dispatch.insertWithParams(inputValue)
  }, [inputValue])

  const handleChangeInputValue = useCallback(event => {
    setInputValue(event.target.value)
  })

  return (
    <div>
      <button onClick={handleInsertAsLast}>insert as the last one</button>
      <button onClick={handleInsertTwiceAsLast}>insert as the last one (twice)</button><br />
      <button onClick={handleInsertAsFirst}>insert as the first one</button>
      <button onClick={handleInsertTwiceAsFirst}>insert as the first one (twice)</button><br />
      <button onClick={handleDeleteFirst}>delete the first one</button>
      <button onClick={handleDeleteLast}>delete the last one</button><br />
      <button onClick={handleClear}>clear</button><br />
      <button onClick={handleClickGetTime}>getTime（Async）</button>
      <button onClick={handleClickGetTimeDelay}>getTime_Delay（Async）</button>
      <button onClick={handleClickGetTimeDebounce}>getTime_Debounce（Async）</button>
      <button onClick={handleClickGetTimeThrottle}>getTime_Throttle（Async）</button>
      <button onClick={handleClickGetTimePend}>getTime_Pend（Async）</button><br />
      <input type="text" value={inputValue} onChange={handleChangeInputValue} />
      <button onClick={handleInsertWithParam}>insert text</button><br />
      <p>times: {timesInStore}</p>
      <p>async: {asyncInStore}</p>
      <p>sync: {syncInStore}</p>
      <br />
      <ol style={{ width: 300, height: 300, overflow: 'auto', border: '1px solid red' }}>
        {
          dateListInStore.map(date => (
            <li>{date}</li>
          ))
        }
      </ol>
    </div>
  )
}

render(<Provider><IndexPage /></Provider>, document.querySelector('#demo'))
