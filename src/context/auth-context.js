import React, { useState } from 'react';

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {}
});

function AuthContextProvider(props) {
  const [authStatus, setAuthStatus] = useState(false);

  function loginHandler() {
    setAuthStatus(true);
  }

  return (
    <AuthContext.Provider value={{login: loginHandler, isAuth: authStatus}}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;