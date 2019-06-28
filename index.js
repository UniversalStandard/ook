import React from 'react'
import knownCssProperties from 'known-css-properties'
import isPropValid from '@emotion/is-prop-valid'
import { css } from 'glamor'
const kebabCase = require('lodash/kebabCase')
const startCase = require('lodash/startCase')
const uuid = require('uuid/v4')

// Ook! Ook! 🍌

const OokContext = React.createContext()
OokContext.displayName = 'Ook'

export const OokConfig = ({ breakpoints = {}, children }) => (
  <OokContext.Provider value={{ breakpoints }}>
    <OokContext.Consumer>
      {ctx => {
        return children
      }}
    </OokContext.Consumer>
  </OokContext.Provider>
)

const states = ['active', 'hover', 'focus', 'visited']

const Ook = props => {
  const { children } = props

  const breakpoints = OokContext?.Consumer?._currentValue?.breakpoints || {}

  const sortedBpNamesBySize = Object.keys(breakpoints).sort(
    (a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]),
  )

  const modifiedProps = Object.assign({}, props)

  const cssProps = Object.entries(props).reduce((acc, [key, val]) => {
    let prefixed = false
    if (key.match(/^_/)) {
      prefixed = true
    }
    const kebabCased = prefixed ? `-${kebabCase(key)}` : kebabCase(key)
    const startCased = startCase(key).replace(/\s+/g, '')

    // Pseudos: States and ::before/::after
    if (states.includes(key) || key === 'before' || key === 'after') {
      const _key = `:${key}`

      Object.entries(val).forEach(([cssProp, _v]) => {
        if (cssProp === 'content' && !_v.trim()) {
          _v = ' '
        }

        const kebabCased = prefixed
          ? `-${kebabCase(cssProp)}`
          : kebabCase(cssProp)

        if (knownCssProperties.all.includes(kebabCased)) {
          if (typeof _v === 'object') {
            // TODO: A bunch of this is duplicated below. Should probably be combined into a function.
            if (typeof _v === 'object') {
              Object.entries(_v).forEach(([bp, v]) => {
                if (bp === sortedBpNamesBySize[0]) {
                  acc[_key] = {
                    ...acc[_key],
                    [cssProp]: v,
                  }
                } else {
                  acc[`@media (min-width: ${breakpoints[bp]})`] = {
                    ...acc[`@media (min-width: ${breakpoints[bp]})`],
                    [_key]: {
                      [cssProp]: v,
                    },
                  }
                }
              })
            }
          }

          if (typeof _v === 'string') {
            acc[_key] = {
              ...acc[_key],
              [cssProp]: _v,
            }
          }
        }
      })
    }

    // Generic css and media queries
    if (knownCssProperties.all.includes(kebabCased)) {
      if (typeof val === 'object') {
        // Overwrite global breakpoint rules
        Object.entries(val).forEach(([bp, v]) => {
          if (bp === sortedBpNamesBySize[0]) {
            acc[prefixed ? startCased : key] = v
          } else {
            acc[`@media (min-width: ${breakpoints[bp]})`] = {
              ...acc[`@media (min-width: ${breakpoints[bp]})`],
              [prefixed ? startCased : key]: v,
            }
          }
        })
      }

      if (typeof val === 'string') {
        acc[prefixed ? startCased : key] = val
      }
    }

    // Some of these props (e.g. backgroundColor) cause React to throw a warning. This removes them from the ook.
    if (!isPropValid(key)) {
      delete modifiedProps[key]
    }

    return acc
  }, {})

  const rule = css(cssProps)

  const styledChild = React.createElement(
    'div',
    {
      ...modifiedProps,
      ...rule,
    },
    children,
  )
  return <>{styledChild}</>
}

export default Ook
