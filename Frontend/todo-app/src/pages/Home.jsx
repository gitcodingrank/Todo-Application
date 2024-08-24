import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  useToast,
  Table,
  Tr,
  Th,
  Td,
  Tbody,
  Thead,
  Text,
  useBreakpointValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider
} from '@chakra-ui/react';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [showForm, setShowForm] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editPriority, setEditPriority] = useState('Low');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const toast = useToast();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.user.id;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };

  const fetchTodos = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'User is not authenticated.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:9000/todos/byUser', {
        userId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      let filteredTodos = response.data;
      console.log(response.data)

      // Apply filters
      if (priorityFilter !== 'All') {
        filteredTodos = filteredTodos.filter(todo => todo.priority === priorityFilter);
      }
      
      if (statusFilter !== 'All') {
        filteredTodos = filteredTodos.filter(todo => todo.status === (statusFilter === 'Completed'));
      }

      setTodos(filteredTodos);
    } catch (error) {
      console.error('Error fetching todos', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch todos. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [priorityFilter, statusFilter, toast]);

  const handleAddTodo = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'User is not authenticated.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post('http://localhost:9000/todos/create', { task: newTask, priority, userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewTask('');
      setPriority('Low');
      setShowForm(false);
      fetchTodos();
      toast({
        title: 'Todo Added',
        description: 'Your todo has been added successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding todo', error);
      toast({
        title: 'Error',
        description: 'Failed to add todo. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateTodo = async () => {
    const token = localStorage.getItem('token');
    if (!editTodoId) return;

    try {
      await axios.put(`http://localhost:9000/todos/${editTodoId}`, {
        task: editTask,
        priority: editPriority
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditTodoId(null);
      setEditTask('');
      setEditPriority('Low');
      setShowForm(false);
      fetchTodos();
      toast({
        title: 'Todo Updated',
        description: 'Your todo has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating todo', error);
      toast({
        title: 'Error',
        description: 'Failed to update todo. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleToggleTodo = async (id) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'User is not authenticated.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.patch(`http://localhost:9000/todos/${id}/toggleStatus`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTodos();
      toast({
        title: 'Todo Updated',
        description: 'Your todo status has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error toggling todo status', error);
      toast({
        title: 'Error',
        description: 'Failed to update todo status. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTodo = async (id) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast({
        title: 'Authentication Error',
        description: 'User is not authenticated.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.delete(`http://localhost:9000/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTodos();
      toast({
        title: 'Todo Deleted',
        description: 'Your todo has been deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting todo', error);
      toast({
        title: 'Error',
        description: 'Failed to delete todo. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchTodoForEdit = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:9000/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const todo = response.data;
      setEditTodoId(id);
      setEditTask(todo.task);
      setEditPriority(todo.priority);
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching todo data for edit', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch todo data. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Determine whether to use a table or card layout based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4}>
      <Heading mb={5}>My Todos</Heading>
      <Stack spacing={4} mb={4}>
        <Stack spacing={4} direction="row" alignItems="center">
          <FormControl>
            <FormLabel>Priority</FormLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </Select>
          </FormControl>
        </Stack>
        <Button colorScheme="teal" onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Cancel' : (editTodoId ? 'Cancel Edit' : 'Add Todo')}
        </Button>
        {showForm && (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Task</FormLabel>
              <Input
                value={editTodoId ? editTask : newTask}
                onChange={(e) => editTodoId ? setEditTask(e.target.value) : setNewTask(e.target.value)}
                placeholder="Enter task"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select
                value={editTodoId ? editPriority : priority}
                onChange={(e) => editTodoId ? setEditPriority(e.target.value) : setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="High">High</option>
              </Select>
            </FormControl>
            <Button
              colorScheme={editTodoId ? 'blue' : 'teal'}
              onClick={editTodoId ? handleUpdateTodo : handleAddTodo}
            >
              {editTodoId ? 'Update Todo' : 'Add Todo'}
            </Button>
          </Stack>
        )}
      </Stack>
      {todos.length === 0 ? (
        <Text>No todos available</Text>
      ) : isMobile ? (
        <Stack spacing={4}>
          {todos.map(todo => (
            <Card key={todo._id} variant="outline">
              <CardHeader>
                <Heading size="md">{todo.task}</Heading>
              </CardHeader>
              <CardBody>
                <Text>Priority: {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</Text>
                <Text>Status: {todo.status ? 'Completed' : 'Pending'}</Text>
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme={todo.status ? 'blue' : 'green'}
                  onClick={() => handleToggleTodo(todo._id)}
                  mr={2}
                >
                  {todo.status ? 'Incomplete' : 'Complete'}
                </Button>
                <Button colorScheme="blue" onClick={() => fetchTodoForEdit(todo._id)} mr={2}>
                  Update
                </Button>
                <Button colorScheme="red" onClick={() => handleDeleteTodo(todo._id)}>
                  Delete
                </Button>
              </CardFooter>
              <Divider />
            </Card>
          ))}
        </Stack>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Task Name</Th>
              <Th>Priority</Th>
              <Th>Status</Th>
              <Th>Complete</Th>
              <Th>Update</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            {todos.map(todo => (
              <Tr key={todo._id}>
                <Td>{todo.task}</Td>
                <Td>{todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</Td>
                <Td>{todo.status ? 'Completed' : 'Pending'}</Td>
                <Td>
                  <Checkbox
                    isChecked={todo.status}
                    onChange={() => handleToggleTodo(todo._id)}
                  />
                </Td>
                <Td>
                  <Button colorScheme="blue" onClick={() => fetchTodoForEdit(todo._id)}>
                    Update
                  </Button>
                </Td>
                <Td>
                  <Button colorScheme="red" onClick={() => handleDeleteTodo(todo._id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Home;
