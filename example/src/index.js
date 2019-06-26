import React from 'react';
import ReactDOM from 'react-dom';
import Ook from 'ook'

const App = () => (
  <>
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
      color="white"
      _webkitFontSmoothing={{
        d: 'subpixel-antialiased'
      }}
    >
      <Ook fontSize="100px" _webkitFontSmoothing="antialiased">
        <Ook background="orange">
          OOK!
        </Ook>
      </Ook>
    </Ook>
  </>
)

ReactDOM.render(<App />, document.getElementById('root'));