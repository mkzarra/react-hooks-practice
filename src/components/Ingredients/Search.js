import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(function() {
    const timer = setTimeout(async function() {
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
      }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
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
