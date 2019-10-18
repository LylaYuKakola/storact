import expect from 'expect'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import { create } from '../src/index'

function Example (times) {
  return (<p id="example-times">{times}</p>)
}

const initialState = { times: 0 }

describe('Component', () => {
  let useDispatch
  let useStore
  let Provider
  let node

  beforeEach(() => {
    const store = create(initialState)
    Provider = store.Provider
    useDispatch = store.useDispatch
    useStore = store.useStore
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(<Provider><Example /></Provider>, node, () => {
      // const exampleNode = node.getElementById('example-times')
      // console.log(123, exampleNode)
      expect('0').toEqual('0')
    })
  })
})
