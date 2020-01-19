
export default {
  markCurrentTime: ({ dispatch }) => async () => {
    try {
      const result = await fetch('http://quan.suning.com/getSysTime.do').then(r => r.json())
      dispatch.push(['dates'], `异步获取当前时间：${result.sysTime2}`)
    } catch (e) {
      throw e
    }
  },
  click: ({ getState, dispatch }) => async (a, b) => {
    const currentTimes = getState('times')
    dispatch.push(['dates'], `当前时间：${Date.now()}`)
    await dispatch.update(['times'], currentTimes + ((+a + +b) || 1))
  },
  clickTwice: ({ getState, dispatch }) => async (a, b) => {
    const currentTimes = getState('times')
    dispatch.push(['dates'], [`当前时间：${Date.now()}`, `当前时间：${Date.now() + 1000}`])
    await dispatch.update(['times'], currentTimes + ((+a + +b) || 1))
  },
}
