import React from 'react'
import knownCssProperties from 'known-css-properties'
import isPropValid from '@emotion/is-prop-valid'
import { css } from 'glamor'
const kebabCase = require('lodash/kebabCase')
const startCase = require('lodash/startCase')

// Ook! Ook! 🍌

const OokContext = React.createContext()
OokContext.displayName = 'OokGlobalConfig'

const states = ['active', 'hover', 'focus', 'visited']

const Ook = props => {
  const { inline, base, globalConfig, children } = props

  if (globalConfig) {
    return (
      <OokContext.Provider value={globalConfig}>
        <OokContext.Consumer>
          {(ctx) => {
            return children
          }}
        </OokContext.Consumer>
      </OokContext.Provider>
    )
  }

  const breakpoints = OokContext ?.Consumer ?._currentValue ?.breakpoints || {}
  const defaults = OokContext ?.Consumer ?._currentValue ?.defaults || {}

  const sortedBpNamesBySize = Object.keys(breakpoints).sort(
    (a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]),
  )

  const modifiedProps = Object.assign({}, props)

  // Create default rules object to be used as the initial accumulator for cssProps (so we can overwrite it)
  const defaultRules = Object.entries(defaults).reduce(
    (acc, [cssProperty, bpVals]) => {
      if (typeof bpVals === 'object') {

        Object.entries(bpVals).forEach(([bp, val]) => {
          if (bp === sortedBpNamesBySize[0]) {
            acc[cssProperty] = val
          } else {
            acc[`@media (min-width: ${breakpoints[bp]})`] = {
              [cssProperty]: val,
            }
          }
        })
      }

      if (typeof bpVals === 'string') {
        acc[cssProperty] = bpVals
      }

      return acc
    }, {}
  )

  const cssProps = Object.entries(props).reduce((acc, [key, val]) => {
    let prefixed = false
    if (key.match(/^_/)) {
      prefixed = true
    }
    const kebabCased = prefixed ? `-${kebabCase(key)}` : kebabCase(key)
    const startCased = startCase(key).replace(/\s+/g, '')

    // States
    if (states.includes(key)) {
      const _key = `:${key}`

      Object.entries(val).forEach(([cssProp, _v]) => {
        const kebabCased = prefixed ? `-${kebabCase(cssProp)}` : kebabCase(cssProp)
        if (knownCssProperties.all.includes(kebabCased)) {
          if (typeof _v === 'object') {
            // TODO: A bunch of this is duplicated below. Should probably be combined into a function.
            // Will likely be tripling it when pseudo elements are added.
            if (typeof _v === 'object') {
              Object.entries(_v).forEach(([bp, v]) => {
                if (bp === sortedBpNamesBySize[0]) {
                  acc[_key] = {
                    ...acc[_key],
                    [cssProp]: v
                  }
                } else {
                  acc[`@media (min-width: ${breakpoints[bp]})`] = {
                    ...acc[`@media (min-width: ${breakpoints[bp]})`],
                    [_key]: {
                      ...[_key],
                      [cssProp]: v
                    }
                  }
                }
              })
            }
          }

          if (typeof _v === 'string') {
            acc[_key] = {
              ...acc[_key],
              [cssProp]: _v
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
  }, defaultRules)

  const rule = css(cssProps)

  if (base) {
    const styledDiv = React.createElement(
      inline ? 'span' : 'div',
      {
        style: {
          fontSize: base,
          display: inline && 'inline-block',
        },
        ...modifiedProps,
        ...rule,
      },
      children,
    )
    return <>{styledDiv}</>
  }

  // El(s)
  if (React.isValidElement(children)) {
    const styledDiv = React.createElement(
      inline ? 'span' : 'div',
      {
        style: {
          fontSize: base,
          display: inline && 'inline-block',
        },
        ...modifiedProps,
        ...rule,
      },
      children,
    )
    return <>{styledDiv}</>
  }

  // No el
  const styledChild = React.createElement(
    inline ? 'span' : 'div',
    {
      style: {
        display: inline && 'inline-block',
      },
      ...modifiedProps,
      ...rule,
    },
    children,
  )
  return <>{styledChild}</>
}

export default Ook
