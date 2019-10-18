
export default {
  markCurrentTime: ({ dispatch }) => async () => {
    try {
      const result = await new Promise(resolve => {
        setTimeout(() => {
          resolve(Date.now())
        }, 1000)
      })
      dispatch.push(['dates'], `当前时间：${result}`)
    } catch (e) {
      throw e
    }
  },
  click: ({ getState, dispatch }) => async (a, b) => {
    const currentTimes = getState().get('times')
    dispatch.push(['dates'], `当前时间：${Date.now()}`)
    await dispatch.update(['times'], currentTimes + ((+a + +b) || 1))
  },
  clickTwice: ({ dispatch }) => async () => {
    await dispatch.click()
    await dispatch.click()
  },
}
