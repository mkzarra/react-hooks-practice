import React, { useContext } from 'react';

import Auth from './components/Auth';
import Ingredients from './components/Ingredients/Ingredients';
import { AuthContext } from './context/auth-context';

function App(props) {
  const authContext = useContext(AuthContext);
  if (authContext.isAuth) return <Ingredients />

  return <Auth />;
};

export default App;
