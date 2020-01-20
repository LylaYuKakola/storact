
export default {
  markCurrentTimeAsync: ({ getState, dispatch }) => async () => {
    try {
      const result = await fetch('http://quan.suning.com/getSysTime.do').then(r => r.json())
      dispatch.push(['dates'], `异步获取当前时间：${result.sysTime2}`)
      const { async, times } = getState(['msg'])
      dispatch.merge(['msg'], {
        async: async + 1,
        times: times + 1,
      })
    } catch (e) {
      throw e
    }
  },
  insertAsLast: ({ getState, dispatch }) => async () => {
    dispatch.push(['dates'], `当前时间：${Date.now()}`)
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  insertTwiceAsLast: ({ getState, dispatch }) => async (a, b) => {
    dispatch.push(['dates'], [`当前时间：${Date.now()}`, `当前时间：${Date.now() + 1000}`])
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  insertAsFirst: ({ getState, dispatch }) => async (a, b) => {
    dispatch.unshift(['dates'], `当前时间：${Date.now()}`)
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  insertTwiceAsFirst: ({ getState, dispatch }) => async (a, b) => {
    dispatch.unshift(['dates'], [`当前时间：${Date.now()}`, `当前时间：${Date.now() + 1000}`])
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  deleteFirst: ({ dispatch }) => async () => {
    dispatch.shift(['dates'])
  },
  deleteLast: ({ dispatch }) => async () => {
    dispatch.pop(['dates'])
  },
}

