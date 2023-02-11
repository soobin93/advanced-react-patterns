// Control Props
// http://localhost:3000/isolated/exercise/06.js

import React, { useEffect, useReducer, useRef, useState } from 'react';
import warning from 'warning';
import { Switch } from '../switch';

const callAll =
  (...fns) =>
  (...args) =>
      fns.forEach(fn => fn?.(...args));

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
};

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
  }
};

const useControlledSwitchWarning = (isControlled) => {
  const { current: wasControlled } = useRef(isControlled);

  useEffect(() => {
    warning(!(isControlled && !wasControlled), 'changing from uncontrolled to controlled');
    warning(!(!isControlled && wasControlled), 'changing from controlled to uncontrolled');
  }, [isControlled, wasControlled]);
};

const useOnChangeReadOnlyWarning = (onChange, isControlled, readonly, propName) => {
  const hasOnChange = Boolean(onChange);

  useEffect(() => {
    warning(!(!hasOnChange && isControlled && !readonly), `An '${propName}' prop provided to useToggle without an 'onChange' handler`);
  }, [hasOnChange, isControlled, readonly, propName]);
};

const useToggle = ({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn = null,
  readonly = false,
} = {}) => {
  const { current: initialState } = useRef({ on: initialOn });
  const [state, dispatch] = useReducer(reducer, initialState);

  const onIsControlled = controlledOn !== null;
  const on = onIsControlled ? controlledOn : state.on;

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useControlledSwitchWarning(onIsControlled);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useOnChangeReadOnlyWarning(onChange, onIsControlled, readonly, 'on');
  }

  const dispatchWithOnChange = (action) => {
    if (!onIsControlled) {
      dispatch(action);
    }

    if (Boolean(onChange)) {
      onChange(reducer({ ...state, on }, action), action);
    }
  };

  const toggle = () => dispatchWithOnChange({ type: actionTypes.toggle });
  const reset = () => dispatchWithOnChange({ type: actionTypes.reset, initialState });

  const getTogglerProps = ({ onClick, ...props } = {}) => {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    };
  };

  const getResetterProps = ({ onClick, ...props } = {}) => {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    };
  };

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  };
};

const Toggle = ({ on: controlledOn, onChange, readonly }) => {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    readonly
  });

  const props = getTogglerProps({ on });

  return <Switch {...props} />
};

const App = () => {
  const [bothOn, setBothOn] = useState(false);
  const [timesClicked, setTimesClicked] = useState(0);

  const handleToggleChange = (state, action) => {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return;
    }

    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  };

  const handleResetClick = () => {
    setBothOn(false)
    setTimesClicked(0)
  };

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} readonly />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  );
};

export default App;

// we're adding the Toggle export for tests
export { Toggle };

/*
eslint
  no-unused-vars: "off",
*/
