/* eslint no-use-before-define: ["error", { "functions": false }] */
import React, { createContext } from 'react'
import knownCssProperties from 'known-css-properties'
import { kebabCase, startCase } from 'lodash'
import isPropValid from '@emotion/is-prop-valid'
import { css } from 'glamor'

// Ook! Ook! 🍌

const OokContext = React.createContext()
OokContext.displayName = 'OokGlobalConfig'

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

  const breakpoints = OokContext.Consumer._currentValue.breakpoints || {}
  const defaults = OokContext.Consumer._currentValue.defaults || {}

  const sortedBpNamesBySize = Object.keys(breakpoints).sort(
    (a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]),
  )

  const modifiedProps = Object.assign({}, props)

  // Create default rules object to be used as the initial accumulator for cssProps (so we can overwrite it)
  const defaultRules = Object.entries(defaults).reduce(
    (acc, [cssProperty, bpVals]) => {
      Object.entries(bpVals).forEach(([bp, val]) => {
        if (bp === sortedBpNamesBySize[0]) {
          acc[cssProperty] = val
        } else {
          acc[`@media (min-width: ${breakpoints[bp]})`] = {
            [cssProperty]: val,
          }
        }
      })

      return acc
    },
    {},
  )

  const cssProps = Object.entries(props).reduce((acc, [key, val]) => {
    // Begin work on overwriting objects and single-value rules
    let prefixed = false
    if (key.match(/^_/)) {
      prefixed = true
    }
    const kebabCased = prefixed ? `-${kebabCase(key)}` : kebabCase(key)
    const startCased = startCase(key).replace(/\s+/g, '')

    if (knownCssProperties.all.includes(kebabCased)) {
      if (typeof val === 'object') {
        // Overwrite default rules
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

      if (typeof val !== 'object') {
        acc[prefixed ? startCased : key] = val
      }
    }

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
