# @universalstandard/ook

`<Ook>` is like [styled-system](https://styled-system.com) and [Rebass](https://rebassjs.org/) but it accepts any camelCased CSS property (vendor prefixed props need camelCased with a `_` in front instead of a `-`).

## Installation

`yarn add @universalstandard/ook`

## Simple Example

```js
import Ook from '@universalstandard/ook'

export default => <Ook background="red">Eek!</Ook>
```

## Example with Breakpoints and Defaults

```js
import Ook from '@universalstandard/ook'

export default () => (
  <Ook
    globalConfig={{
      breakpoints: {
        default: '0',
        tablet: '768px',
        desktop: '1440px'
      },
      defaults: {
        fontSize: '20px',
        color: {
          default: 'purple',
          tablet: 'black'
        }
      }
    }}
  >
    <Ook
      background={{
        default: 'red',
        tablet: 'blue',
        desktop: 'green'
      }}
      padding={{
        default: '10px',
        desktop: '40px'
      }}
    >
      <Ook fontWeight="bold">Eek!</Ook>
    </Ook>
  </Ook>
)
```

## Props

#### globalConfig (object)

Takes an object with `breakpoints` and `defaults` objects.

#### inline (bool)

Ooks are `<div>`s by default. `<Ook inline>...</Ook>` will return a `<span>`.

#### base (bool)

Wraps the element in a `<span>` or `<div>` (depending on `inline`) with `style={{ fontSize: base }}`. This is useful when you simply want to scale a component up by sizing everything inside it with `em`s.

### active, hover, focus, visited (object)

Allows you to do things like:

```js
<Ook
  background="red"
  color="white"
  hover={{
    background: 'blue',
    color: {
      tablet: 'yellow'
    }
  }}
>
```

---

That's it. That's the API. 🍌
