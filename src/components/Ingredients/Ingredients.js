import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  async function addIngredientHandler(ingredient) {
    const response = await fetch('https://react-hooks-practice-48016.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    });

    const responseData = response.json();
    setUserIngredients(function(prevIngredients) {
      return [...prevIngredients, { id: responseData.name , ...ingredient }];
    });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
