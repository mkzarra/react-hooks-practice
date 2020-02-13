import React, { useReducer, useCallback, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

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

function Ingredients() {
  const [userIngredients, dispatchIngredients] = useReducer(ingredientReducer, [])
  const { isLoading, error, data, sendRequest, extra, identifier } = useHttp();

  useEffect(function() {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') dispatchIngredients({
      type: 'DELETE',
      id: extra
    });
    else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') dispatchIngredients({
      type: 'ADD',
      ingredient: { id: data.name, ...extra}
    })
  }, [data, extra, identifier, isLoading, error])

  const filteredIngredientsHandler = useCallback(function(filteredIngredients) {
    dispatchIngredients({ type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = useCallback(function (ingredient) {
    sendRequest(
      'https://react-hooks-practice-48016.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
    // dispatchHttp({ type: 'SEND' });
    // try {
    //   const response = await fetch('https://react-hooks-practice-48016.firebaseio.com/ingredients.json', {
    //     method: 'POST',
    //     body: JSON.stringify(ingredient),
    //     headers: { "Content-Type": "application/json" }
    //   });

    //   const responseData = await response.json();
      
    //   dispatchIngredients({ type: 'ADD', ingredient: {
    //     id: responseData.name,
    //     ...ingredient
    //   }});
    //   dispatchHttp({ type: 'RESPONSE' });
    // } catch(error) {
    //   dispatchHttp({ type: 'ERROR', responseError: error.message });
    // }
  }, []);

  const removeIngredientHandler = useCallback(function(id) {
    sendRequest(
      `https://react-hooks-practice-48016.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  const clearError = useCallback(function() {
    // dispatchHttp({ type: 'CLEAR' });
  }, []);
    
    return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} clearError={clearError} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
