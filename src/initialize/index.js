/**
 * @desc 对初始数据进行immutable的初始化
 */

import { fromJS } from 'immutable'

export default function initialize(initialState = {}) {
  return fromJS(initialState)
}
