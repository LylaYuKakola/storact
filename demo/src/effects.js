
export default {
  // 调用接口获取当前时间，并记录
  markCurrentTimeAsync: ({ getState, dispatch }) => async () => {
    try {
      const result = await fetch('http://quan.suning.com/getSysTime.do').then(r => r.json())
      dispatch.push(['dates'], `异步获取当前时间：${result.sysTime2}`)
      const { async, times } = getState(['msg'])
      await dispatch.merge(['msg'], {
        async: async + 1,
        times: times + 1,
      })
    } catch (e) {
      throw e
    }
  },
  // 把记录插入到最后
  insertAsLast: ({ getState, dispatch }) => async () => {
    dispatch.push(['dates'], `当前时间：${Date.now()}`)
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  // 把记录插入到最后（执行两次）
  insertTwiceAsLast: ({ getState, dispatch }) => async () => {
    dispatch.push(['dates'], [`当前时间：${Date.now()}`, `当前时间：${Date.now() + 1000}`])
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 2,
      times: times + 2,
    })
  },
  // 把记录插入到最开始
  insertAsFirst: ({ getState, dispatch }) => async () => {
    dispatch.unshift(['dates'], `当前时间：${Date.now()}`)
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  // 把记录插入到最开始（执行两次）
  insertTwiceAsFirst: ({ getState, dispatch }) => async () => {
    dispatch.unshift(['dates'], [`当前时间：${Date.now()}`, `当前时间：${Date.now() + 1000}`])
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 2,
      times: times + 2,
    })
  },
  // 插入两次异步数据
  insertTwiceAsync: ({ dispatch }) => async () => {
    await dispatch.markCurrentTimeAsync()
    await dispatch.markCurrentTimeAsync()
  },
  // 插入记录（带参数）
  insertWithParams: ({ getState, dispatch }) => async value => {
    dispatch.push(['dates'], value)
    const { sync, times } = getState(['msg'])
    dispatch.merge(['msg'], {
      sync: sync + 1,
      times: times + 1,
    })
  },
  // 删除第一条
  deleteFirst: ({ dispatch }) => async () => {
    dispatch.shift(['dates'])
  },
  // 删除最后一条
  deleteLast: ({ dispatch }) => async () => {
    dispatch.pop(['dates'])
  },
}

