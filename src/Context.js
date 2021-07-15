import React, { createContext, useContext, useState } from 'react';

const Context = createContext();

export const Provider = ({ children, ...props }) => {
  const [defaultProps, setDefaultProps] = useState(props);

  return <Context.Provider value={{defaultProps}}>{children}</Context.Provider>;
};

export const useDefaults = props => {
  const context = useContext(Context);

  if ('undefined' === typeof context) {
    return props;
  } else {
    console.log(context.defaultProps);
    return { ...context.defaultProps, ...props };
  }
};
