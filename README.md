# inline-css-webpack-loader

Convert `scss`, `sass`, `css` files to React friendly objects that you can use to inline styles to your components (so you can easier distribute them)

e.g.

```scss

// button.scss 
.something
{
  color : red;
  background-color: blue;

  &:hover
  {
    color: blue;
  }

  .somethingElse
  {
    color:green;
  }

  &:nth-child(2)
  {
    text-align: center;
    font-size: 12px;
    font-style: italic;
  }
}
```

Will generate the following object

```js
import React, { Component } from 'react';

import * as cssMap from './button.scss';


/*
cssMap.something = {
  backgroundColor: "blue",
  color:"red"
};

cssMap.something__somethingElse = { 
  color: "green"
};

cssMap.something_hover = { 
  color: "blue"
};

cssMap.something_nth_child_2 = { 
   textAlign: "center",
   fontSize: "12px",
   fontStyle: "italic"
}

*/


export default class Button extends Proto
{

  render() {

    return (<button style={ cssMap.something }>
               Click me
            </button>)
  }
}
