/* eslint no-use-before-define: ["error", { "functions": false }] */
import React from 'react'
import knownCssProperties from 'known-css-properties'
import { kebabCase, startCase } from 'lodash'
import isPropValid from '@emotion/is-prop-valid'
import { css } from 'glamor'

// Ook! Ook! 🍌

const breakpoints = {
  d: '0px',
  xs: '320px',
  s: '640px',
  m: '768px',
  l: '960px',
  xl: '1280px',
  xxl: '1920px',
  xxxl: '2400px',
}

const defaults = {
  fontFamily: {
    d: 'sans-serif'
  },
  fontSize: generateScale(11, 13),
}

function generateScale(minPx, maxPx) {
  if (typeof minPx !== 'number' || typeof maxPx !== 'number') {
    throw new Error('minPx and maxPx in generateScale() must be numbers')
  }

  const fontScale = stepScale(minPx, maxPx, Object.keys(breakpoints).length)
  return Object.keys(breakpoints).reduce((acc, bp, i) => {
    acc[bp] = `${fontScale[i] * 0.1}em`
    return acc
  }, {})
}

// Finds the step increment between two numbers and returns an array using that increment for the number of steps.
// e.g. stepScale(5, 10, 4) // [5, 6.6667 8.3334, 10 ]
function stepScale(min, max, numberOfSteps) {
  const _numberOfSteps = numberOfSteps - 1
  const scaleBy = (max - min) / _numberOfSteps

  const arr = []
  for (let i = 0; i <= _numberOfSteps; i += 1) {
    arr.push(min + scaleBy * i)
  }
  return arr
}

const sortedBpNamesBySize = Object.keys(breakpoints).sort(
  (a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]),
)

const Ook = props => {
  const { inline, base, children } = props

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
      if (typeof val !== 'object') {
        acc[prefixed ? startCased : key] = `${val} !important`
      }

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
    }

    if (!isPropValid(key)) {
      delete modifiedProps[key]
    }

    return acc
  }, defaultRules)

  const rule = css(cssProps)

  if (base) {
    console.log(children)

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
