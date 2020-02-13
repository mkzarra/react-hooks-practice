import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function ingredientReducer(currentIngredients, action) {
  switch(action.type) {
    case 'SET': return action.ingredients;
    case 'ADD': return [...currentIngredients, action.ingredient];
    case 'DELETE': return currentIngredients.filter(function(ing) {
      return ing.id !== action.id;
    });
    default: throw new Error("Should not be reached: ingredentsReducer");
  }
}

function httpReducer(httpState, action) {
  switch(action.type) {
    case 'SEND': return { loading: true, error: null }
    case 'RESPONSE': return { ...httpState, loading: false }
    case 'ERROR': return { loading: false, error: action.responseError }
    case 'CLEAR': return { ...httpState, error: null }
    default: throw new Error("Should not be reached: httpReducer");
  }
}

function Ingredients() {
  const [userIngredients, dispatchIngredients] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const filteredIngredientsHandler = useCallback(function(filteredIngredients) {
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = useCallback(async function (ingredient) {
    dispatchHttp({ type: 'SEND' });
    try {
      const response = await fetch('https://react-hooks-practice-48016.firebaseio.com/ingredients.json', {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" }
      });

      const responseData = await response.json();
      
      dispatchIngredients({ type: 'ADD', ingredient: {
        id: responseData.name,
        ...ingredient
      }});
      dispatchHttp({ type: 'RESPONSE' });
    } catch(error) {
      dispatchHttp({ type: 'ERROR', responseError: error.message });
    }
  }, []);

  const removeIngredientHandler = useCallback(async function(ingredientId) {
    dispatchHttp({ type: 'SEND' });
    try { 
      await fetch(`https://react-hooks-practice-48016.firebaseio.com/ingredients/${ingredientId}.json`, {
        method: 'DELETE'
      });
      
      dispatchIngredients({ type: 'DELETE', id: ingredientId });
      dispatchHttp({ type: 'RESPONSE' });
    } catch(error) {
      dispatchHttp({ type: 'ERROR', responseError: error.message });
    }
  }, []);

  const clearError = useCallback(function() {
    dispatchHttp({ type: 'CLEAR' });
  }, []);
    
    return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} clearError={clearError} loading={httpState.Loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
