import initialState from './initialState'
import middlewares, { CLICK, REVERT } from './middlewares'
import { create } from '../../src'

const { useDispatch, useStore, Provider } = create({ initialState, middlewares })
export { useDispatch, useStore, Provider }
