import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchTodoApi } from '../api/api';

const SearchTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setTodos(response.data);
        setFilteredTodos(response.data);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Search form validation schema
  const validationSchema = Yup.object({
    query: Yup.string().required('Search query is required'),
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    const searchQuery = values.query.toLowerCase();
    const results = todos.filter(todo =>
      todo.title.toLowerCase().includes(searchQuery)
    );

    setFilteredTodos(results);
    setSubmitting(false);
  };

  return (
    <div>
      <h1>Todo Search</h1>
      <Formik
        initialValues={{ query: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="query">Search</label>
              <Field type="text" name="query" placeholder="Enter search query" />
              <ErrorMessage name="query" component="div" style={{ color: 'red' }} />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Search
            </button>
          </Form>
        )}
      </Formik>

      {/* Handle loading, error, and no results */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {filteredTodos.length === 0 && !loading && <p>No results found</p>}

      {/* Render filtered todos */}
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            {todo.title} (Status: {todo.completed ? 'Completed' : 'Pending'})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchTodos;
