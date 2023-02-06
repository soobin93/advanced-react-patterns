// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import React, { useState } from 'react';
import { Switch } from '../switch';

const callAll = (...fns) => (...args) => {
  fns.forEach(fn => {
    fn && fn(...args);
  });
};

const useToggle = () => {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);

  const getTogglerProps = ({ onClick, ...props } = {}) => ({
    'aria-pressed': on,
    onClick: callAll(onClick, toggle),
    ...props
  });

  return { on, toggle, getTogglerProps };
}

const App = () => {
  const { on, getTogglerProps } = useToggle();

  return (
    <div>
      <Switch {...getTogglerProps({ on })} />
      <hr />
      <button
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  );
};

export default App;

/*
eslint
  no-unused-vars: "off",
*/
