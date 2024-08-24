// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useBreakpointValue,
  Container,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async () => {
    try {
      await axios.post('https://todo-application-vzy2.onrender.com/users/register', { name, email, password, mobile });
      toast({
        title: 'Registration Successful',
        description: 'You have been registered successfully. Please log in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred during registration. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Responsive form layout settings
  const formWidth = useBreakpointValue({ base: '100%', md: '75%', lg: '50%' });

  return (
    <Container maxW="container.xl" p={4}>
      <Box
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        maxW={formWidth}
        mx="auto"
      >
        <Heading mb={6} textAlign="center">Register</Heading>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Mobile</FormLabel>
            <Input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleRegister}>
            Register
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Register;
