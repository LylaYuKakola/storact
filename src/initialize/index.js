/**
 * @desc 获取初始化的状态
 */

import { fromJS } from 'immutable'

export default function initialize(initialState = null) {
  return fromJS(initialState)
}
