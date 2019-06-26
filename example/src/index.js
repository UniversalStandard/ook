import React from 'react';
import ReactDOM from 'react-dom';
import Ook from '@universalstandard/ook'

const App = () => (
  <>
    <Ook
      globalConfig={{
        breakpoints: {
          d: '0px',
          xs: '320px',
          s: '640px',
          m: '768px',
          l: '960px',
          xl: '1280px',
          xxl: '1920px',
          xxxl: '2400px',
        },
        defaults: {
          fontFamily: 'Georgia'
        }
      }}
    >
      <Ook
        backgroundColor={{
          d: 'red',
          s: 'blue',
          l: 'green'
        }}
        padding={{
          d: '1rem',
          s: '5rem',
          m: '12rem'
        }}
        color={{
          d: 'white',
          l: 'blue'
        }}
        _webkitFontSmoothing={{
          d: 'subpixel-antialiased'
        }}
      >
        <Ook fontSize="100px" fontFamily={{d: 'fantasy' }} _webkitFontSmoothing="antialiased">
          <Ook>Georgia</Ook>
          <Ook
            fontFamily={{
              d: 'sans-serif'
            }}
            color={{
              d: 'yellow'
            }}
            background="orange"
          >
            OOK!
          </Ook>
        </Ook>
      </Ook>
    </Ook>
  </>
)

ReactDOM.render(<App />, document.getElementById('root'));