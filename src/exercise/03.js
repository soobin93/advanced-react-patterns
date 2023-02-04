// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import React, { createContext, useContext, useState } from 'react';
import { Switch } from '../switch';

const ToggleContext = createContext();
ToggleContext.displayName = 'ToggleContext';

const Toggle = ({ children }) => {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);

  return <ToggleContext.Provider value={{ on, toggle }} children={children} />;
};

const useToggle = () => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('This component should be rendered within a <Toggle /> component');
  }

  return context;
};

const ToggleOn = ({ children }) => {
  const { on } = useToggle();
  return on ? children : null;
};

const ToggleOff = ({ children }) => {
  const { on } = useToggle();
  return on ? null : children;
};

const ToggleButton = ({ ...props }) => {
  const { on, toggle } = useToggle();
  return <Switch on={on} onClick={toggle} {...props} />;
};

const App = () => (
  <div>
    <Toggle>
      <ToggleOn>The button is on</ToggleOn>
      <ToggleOff>The button is off</ToggleOff>
      <div>
        <ToggleButton />
      </div>
    </Toggle>
  </div>
);

export default App;

/*
eslint
  no-unused-vars: "off",
*/
