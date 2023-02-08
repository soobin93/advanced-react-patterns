// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import React, { useReducer, useRef, useState } from 'react';
import { Switch } from '../switch';

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset'
}

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args));

const toggleReducer = (state, { type, initialState }) => {
  switch (type) {
    case actionTypes.toggle: {
      return { on: !state.on };
    }
    case actionTypes.reset: {
      return initialState;
    }
    default: {
      throw new Error(`Unsupported type: ${type}`);
    }
  };
};

const useToggle = ({ initialOn = false, reducer = toggleReducer } = {}) => {
  const { current: initialState } = useRef({ on: initialOn });
  const [state, dispatch] = useReducer(reducer, initialState);
  const { on } = state;

  const toggle = () => dispatch({ type: 'toggle' });
  const reset = () => dispatch({ type: 'reset', initialState });

  const getTogglerProps = ({ onClick, ...props } = {}) => {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  };

  const getResetterProps = ({ onClick, ...props } = {}) => {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  };

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  };
};

const App = () => {
  const [timesClicked, setTimesClicked] = useState(0);
  const clickedTooMuch = timesClicked >= 4;

  const toggleStateReducer = (state, action) => {
    if (action.type === actionTypes.toggle && timesClicked >= 4) {
      return { on: state.on };
    }

    // default state reducer (better user experience for this library)
    return toggleReducer(state, action);
  };

  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  });

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  );
};

export default App;

/*
eslint
  no-unused-vars: "off",
*/
