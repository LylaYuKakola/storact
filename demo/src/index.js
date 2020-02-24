import React, { useState, useCallback } from 'react'
import { render } from 'react-dom'
import { useDispatch, useStoreState, Provider } from './myStore'

function IndexPage() {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState()
  const timesInStore = useStoreState(['msg', 'times']) || 0
  const asyncInStore = useStoreState(['msg', 'async']) || 0
  const syncInStore = useStoreState(['msg', 'sync']) || 0
  const dateListInStore = useStoreState(['dates']) || []

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

  // 延迟两秒
  const handleClickGetTimeDelay = useCallback(() => {
    const dispatchWithDelay = dispatch.config({ delay: 2000 })
    dispatchWithDelay.markCurrentTimeAsync()
  }, [dispatch])

  // 两秒防抖
  const handleClickGetTimeDebounce = useCallback(() => {
    const dispatchWithDebounce = dispatch.config({ debounce: 2000 })
    dispatchWithDebounce.markCurrentTimeAsync()
  }, [dispatch])

  // 两秒节流
  const handleClickGetTimeThrottle = useCallback(() => {
    const dispatchWithThrottle = dispatch.config({ throttle: 2000 })
    dispatchWithThrottle.markCurrentTimeAsync()
  }, [dispatch])

  // 设置挂起操作（可调大getTimeAsync中timer的时间）
  const handleClickGetTimePend = useCallback(() => {
    const dispatchWithPend = dispatch.config({ pend: true })
    dispatchWithPend.markCurrentTimeAsync()
  }, [dispatch])

  const handleInsertWithParam = useCallback(() => {
    dispatch.insertWithParams(inputValue)
  }, [dispatch, inputValue])

  const handleChangeInputValue = useCallback(event => {
    setInputValue(event.target.value)
  }, [])

  return (
    <div>
      <button onClick={handleInsertAsLast}>insert as the last one</button>
      <button onClick={handleInsertTwiceAsLast}>
        insert as the last one (twice)
      </button>
      <br />
      <button onClick={handleInsertAsFirst}>insert as the first one</button>
      <button onClick={handleInsertTwiceAsFirst}>
        insert as the first one (twice)
      </button>
      <br />
      <button onClick={handleDeleteFirst}>delete the first one</button>
      <button onClick={handleDeleteLast}>delete the last one</button>
      <br />
      <button onClick={handleClear}>clear</button>
      <br />
      <br />
      <button onClick={handleClickGetTime}>getTime（Async）</button>
      <br />
      <button onClick={handleClickGetTimeDelay}>getTime_Delay（Async）</button>
      <br />
      <button onClick={handleClickGetTimeDebounce}>
        getTime_Debounce（Async）
      </button>
      <button onClick={handleClickGetTimeThrottle}>
        getTime_Throttle（Async）
      </button>
      <button onClick={handleClickGetTimePend}>getTime_Pend（Async）</button>
      <br />
      <br />
      <input type="text" value={inputValue} onChange={handleChangeInputValue} />
      <button onClick={handleInsertWithParam}>insert text</button>
      <br />
      <p>times: {timesInStore}</p>
      <p>async: {asyncInStore}</p>
      <p>sync: {syncInStore}</p>
      <br />
      <ol
        style={{
          width: 300,
          height: 300,
          overflow: 'auto',
          border: '1px solid red',
        }}
      >
        {dateListInStore.map((date, index) => (
          <li key={`${date}-${index}`}>{date}</li>
        ))}
      </ol>
    </div>
  )
}

render(<Provider><IndexPage /></Provider>, document.querySelector('#demo'))
