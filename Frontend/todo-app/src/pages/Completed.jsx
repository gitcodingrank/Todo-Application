// src/pages/Completed.js
import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Button, Stack, Heading } from '@chakra-ui/react';
import axios from 'axios';

const Completed = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:9000/todos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTodos(response.data.filter(todo => todo.completed));
      } catch (error) {
        console.error('Error fetching todos', error);
      }
    };

    fetchTodos();
  }, []);

  const handleToggleTodo = async (id, status) => {
    try {
      await axios.patch(`http://localhost:9000/todos/${id}/toggleStatus`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const response = await axios.get('http://localhost:9000/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTodos(response.data.filter(todo => todo.completed));
    } catch (error) {
      console.error('Error toggling todo status', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const response = await axios.get('http://localhost:9000/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTodos(response.data.filter(todo => todo.completed));
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };

  return (
    <Box>
      <Heading mb={5}>Completed Todos</Heading>
      <Stack spacing={4}>
        {todos.map(todo => (
          <Box key={todo._id} p={4} shadow="md" borderWidth="1px">
            <Checkbox
              isChecked={todo.completed}
              onChange={() => handleToggleTodo(todo._id, todo.completed)}
            >
              {todo.text}
            </Checkbox>
            <Button colorScheme="red" mt={2} onClick={() => handleDeleteTodo(todo._id)}>
              Delete
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Completed;
