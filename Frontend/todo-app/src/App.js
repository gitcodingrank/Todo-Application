// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Completed from './pages/Completed';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { Container } from '@chakra-ui/react';

function App() {
  return (
    <Router>
      <Navbar/>
      <Container maxW="container.lg" mt="100px">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/completed"
            element={
              <PrivateRoute>
                <Completed />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
