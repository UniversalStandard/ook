import React from 'react'
import knownCssProperties from 'known-css-properties'
import styled from 'styled-components'
import mqpacker from 'mqpacker'
const kebabCase = require('lodash/kebabCase')

const postcss = require('postcss')

// Ook! Ook! 🍌

const OokContext = React.createContext()
OokContext.displayName = 'Ook'

export const OokConfig = ({
  breakpoints = {},
  cssProperties = knownCssProperties.all,
  children,
}) => (
  <OokContext.Provider value={{ breakpoints, cssProperties }}>
    <OokContext.Consumer>
      {ctx => {
        return children
      }}
    </OokContext.Consumer>
  </OokContext.Provider>
)

const states = ['active', 'hover', 'focus', 'visited']
const notValidCSSProperties = ['children', 'el', 'src']

const Ook = ({ children, el = 'div', ...props }) => {
  const breakpoints = OokContext['1']
    ? OokContext['1']?.breakpoints
    : OokContext?.Consumer?._currentValue?.breakpoints
    ? OokContext.Consumer._currentValue.breakpoints
    : {}

  const cssProperties = OokContext['1']
    ? OokContext['1']?.cssProperties
    : OokContext?.Consumer?._currentValue?.cssProperties
    ? OokContext.Consumer._currentValue.cssProperties
    : []

  const sortedBpNamesBySize = Object.keys(breakpoints).sort(
    (a, b) => parseInt(breakpoints[a], 10) - parseInt(breakpoints[b], 10),
  )

  const jsonifiedProps = props

  const styledString = Object.entries(props).reduce((acc, [key, val]) => {
    if (notValidCSSProperties.includes(key)) return acc

    let prefixed = false
    if (key.match(/^_/)) {
      prefixed = true
    }
    const keb = prefixed ? `-${kebabCase(key)}` : kebabCase(key)

    // Pseudo classes
    if (states.includes(key) || key === 'after' || key === 'before') {
      Object.entries(val).forEach(([cssProp, _v]) => {
        if (cssProp === 'content' && !_v.trim()) {
          _v = "''"
        }

        const _key =
          key === 'after' || key === 'before' ? `&::${key}` : `&:${key}`

        const keb = prefixed ? `-${kebabCase(cssProp)}` : kebabCase(cssProp)

        if (cssProperties.includes(keb)) {
          // TODO: A bunch of this is duplicated below. Should probably be combined into a function.
          if (typeof _v === 'object') {
            Object.entries(_v).forEach(([bp, v]) => {
              if (bp === sortedBpNamesBySize[0]) {
                acc += `${_key} { ${keb}: ${v}; }`
              } else {
                acc += `@media (min-width: ${
                  breakpoints[bp]
                }) { ${_key} { ${keb}: ${v}; } }`
              }
            })
          }

          if (typeof _v === 'string') {
            acc += `${_key} { ${keb}: ${_v}; }`
          }
        }
      })
    }

    // Generic css and media queries
    if (cssProperties.includes(keb)) {
      if (typeof val === 'object') {
        jsonifiedProps[key] = JSON.stringify(val)

        // Overwrite global breakpoint rules
        Object.entries(val).forEach(([bp, v]) => {
          if (bp === sortedBpNamesBySize[0]) {
            acc += `${keb}: ${v};`
          } else {
            acc += `@media (min-width: ${breakpoints[bp]}) { ${keb}: ${v}; }`
          }
        })
      }

      if (typeof val === 'string') {
        acc += `${keb}: ${val};`
      }
    }

    return acc
  }, '')

  const S = styled(el)`
    ${mqpacker.pack(styledString).css}
  `

  return <S {...jsonifiedProps}>{children}</S>
}

export default Ook
