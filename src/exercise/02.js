// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import React, { Children, cloneElement, useState } from 'react'
import { Switch } from '../switch';

const Toggle = ({ children }) => {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);

  return Children.map(children, (child, index) => {
    return typeof child.type === 'string'
      ? child
      : cloneElement(child, { on, toggle });
  });
}

const ToggleOn = ({ on, children }) => on ? children : null;
const ToggleOff = ({ on, children }) => on ? null : children;
const ToggleButton = ({ on, toggle }) => <Switch on={on} onClick={toggle} />

const App = () => (
  <div>
    <Toggle>
      <ToggleOn>The button is on</ToggleOn>
      <ToggleOff>The button is off</ToggleOff>
      <span>Hello</span>
      <ToggleButton />
    </Toggle>
  </div>
);

export default App;

/*
eslint
  no-unused-vars: "off",
*/
