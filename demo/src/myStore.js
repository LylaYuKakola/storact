import initialState from './initialState'
import middlewares from './middlewares'
import effects from './effects'
import storact from '../../src'

const test1 = storact({ initialState, middlewares, effects, namespace: 'test1' })
const test2 = storact({ initialState, middlewares, effects, namespace: 'test2' })

const { useDispatch, useStoreState, Provider } = storact({ initialState, middlewares, effects, namespace: 'Global' })

export { useDispatch, useStoreState, Provider }
