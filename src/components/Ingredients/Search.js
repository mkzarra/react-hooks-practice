import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients, clearError } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const [error, setError] = useState();
  const inputRef = useRef();

  useEffect(function() {
    const timer = setTimeout(async function() {
      try {
        if (enteredFilter === inputRef.current.value) {
          const query = (
            enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`
          );
          const response = await fetch('https://react-hooks-practice-48016.firebaseio.com/ingredients.json' + query);
          const responseData = await response.json();
          const loadedIngredients = [];
          
          for (const key in responseData) {
            loadedIngredients.push({
              id: key,
              title: responseData[key].title,
              amount: responseData[key].amount
            });
          }
          
          onLoadIngredients(loadedIngredients);
        } 
        
        return function() {
          clearTimeout(timer);
        }
      } catch(error) {
        setError("Something went wrong!\n\n" + error);
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef, setError]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
