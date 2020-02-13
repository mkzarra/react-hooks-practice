import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIngredientsHandler = useCallback(filteredIngredients =>
      setUserIngredients(filteredIngredients),[]);

  async function addIngredientHandler(ingredient) {
    setIsLoading(true);

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
  }

  async function removeIngredientHandler(ingredientId) {
    setIsLoading(true);

    await fetch(`https://react-hooks-practice-48016.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    });

    setIsLoading(false);
    
    setUserIngredients(function(prevIngredients) {
      return prevIngredients.filter(function(ingredient) {
        return ingredient.id !== ingredientId;
      });
    });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
