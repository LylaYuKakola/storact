import React, { useCallback } from 'react'
import { isFunction, isArray } from '../utils/typeJudgement'
import { warn } from '../utils/log'

function useProviders({ providers }) {
  return useCallback(({ children }) => {
    return [children, ...providers].reduce((curr, next) => {
      return next({ children: curr })
    })
  }, [providers])
}

export default function Combine({ children, providers }) {
  if (!providers) return children
  if (!providers.length) return children
  if (!(isArray(providers)) || providers.some(p => !(isFunction(p)))) {
    warn(`property "providers" of Combine Component should be an array of function`)
    return children
  }
  const Providers = useProviders({ providers })
  return (<Providers>{children}</Providers>)
}
