import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients =>
      setUserIngredients(filteredIngredients),[]);

  async function addIngredientHandler(ingredient) {
    setIsLoading(true);
    try {
      const response = await fetch('https://react-hooks-practice-48016.firebaseio.com/ingredients.json', {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" }
      });

      setIsLoading(false);
      const responseData = await response.json();

      setUserIngredients(function(prevIngredients) {
        return [...prevIngredients, { id: responseData.name , ...ingredient }];
      });
    } catch(error) {
      setError("Something went wrong!\n\n" + error);
      setIsLoading(false);
    }
  }

  async function removeIngredientHandler(ingredientId) {
    setIsLoading(true);
    try { 
      await fetch(`https://react-hooks-practice-48016.firebaseio.com/ingredients/${ingredientId}.json`, {
        method: 'DELETE'
      });
      
      setIsLoading(false);
      
      setUserIngredients(function(prevIngredients) {
        return prevIngredients.filter(function(ingredient) {
          return ingredient.id !== ingredientId;
        });
      });
    } catch(error) {
      setError("Something went wrong!\n\n" + error);
      setIsLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }
    
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
