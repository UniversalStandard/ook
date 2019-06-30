# @universalstandard/ook

Ook is a dumb styling component for React. It's like [Rebass](https://rebassjs.org/), but the API is any camelCased CSS property and an elegant breakpoint pattern. It also uses styled-components@5 under the hood, so it looks really pretty in React Devtools (especially with the [experimental branch](https://react-devtools-experimental-chrome.now.sh/)).

Ook takes about 15 seconds to master.

## Installation

`yarn add @universalstandard/ook`

## Simple Example

```js
import Ook from '@universalstandard/ook'

export default () => <Ook background="tomato">Eek!</Ook>
```

## Demo

https://codesandbox.io/s/ook-58nxe

## Example with Breakpoints

```js
import Ook, { OokConfig } from '@universalstandard/ook'

const Eek = () => (
  <OokConfig
    breakpoints={{
      default: '0',
      tablet: '768px',
      desktop: '1440px',
    }}
  >
    <Ook
      fontFamily="sans-serif"
      color="white"
      background={{
        default: 'tomato',
        tablet: 'dodgerblue',
        desktop: 'hotpink',
      }}
      padding={{
        default: '2rem',
        desktop: '4rem',
      }}
    >
      <Ook fontWeight="bold">Eek!</Ook>
    </Ook>
  </OokConfig>
)

export default Eek
```

## Props

#### Any camelCased CSS property

https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#Keyword_index

Vendor prefixed props need camelCased with a `_` in front instead of a `-`. E.g. `<Ook _webkitFontSmoothing="antialiased">`

> **Possible Performance Concerns:** There is an array of [1000+ CSS property names](https://www.npmjs.com/package/known-css-properties) that are looped over for every `<Ook>` prop. Seems fine right now, but it might not be performant enough for your needs. In the future we plan to expose a config option to select which list of CSS properties you care about (99% of CSS use cases are covered by a [small amount](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) of properties) and maintain common lists of these properties for your convenience.

#### active, hover, focus, visited (object)

Support for [pseudo classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes):

```js
<Ook
  background="tomato"
  color="white"
  hover={{
    background: 'dodgerblue',
    color: {
      tablet: 'springgreen'
    }
  }}
>
```

#### before, after (object)

Support for [pseudo elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements):

```js
<Ook
  position="relative"
  after={{
    content: '',
    display: 'block',
    background: 'tomato',
    width: '100px',
    height: '100px'
  }}
>
```

> **Note:** Pseudo classes (`hover`, etc.) and breakpoints within _pseudo elements_ aren't currently supported but they will be in the future.

#### css (string)

styled-components [`css` prop](https://medium.com/styled-components/announcing-native-support-for-the-css-prop-in-styled-components-245ca5252feb) support as an escape hatch. Handy for things like refactoring. Supports nesting and pseudo-classes/elements.

#### el (string)

Any valid HTML element to render the `<Ook>` as. Defaults to `div`.

#### {...props}

Additional props work as expected.

##### `el` and `css` and additional props Example:

```js
<Ook
  el="ul"
  background="hotpink"
  css={`
    > *:hover {
      background: springgreen;
    }
  `}
  onClick={() => console.log(123)}
>
  <li>a</li>
  <li>b</li>
  <li>c</li>
</Ook>
```

## Tips

- If you ever feel like you're looking at a mountain of `<Ook>`s, you should break your component down into smaller components with only a few `<Ook>`s and friendlier names. It sounds like cliche advice, but it's particularly applicable to Ook.

---

Have a banana for making it to the end. 🍌
