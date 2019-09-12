import initialState from './initialState'
import middleware, { CLICK, REVERT } from './middleware'
import storact from '../../src'

const { useDispatch, useStore, Provider } = storact({ initialState, middleware })
export { useDispatch, useStore, Provider }
