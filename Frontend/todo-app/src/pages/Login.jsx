import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, useBreakpointValue, Center, useToast } from '@chakra-ui/react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://todo-application-vzy2.onrender.com/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed', error);
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please check your email and password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center h="90vh" bg="gray.50">
      <Box
        p={{ base: 4, sm: 8, md: 12 }}
        bg="white"
        borderRadius="md"
        boxShadow="md"
        maxW={{ base: '90%', sm: '400px' }}
        w="full"
      >
        <Heading mb={4} textAlign="center" size={useBreakpointValue({ base: 'lg', md: 'xl' })}>
          Login
        </Heading>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button
            colorScheme="teal"
            onClick={handleLogin}
            size="lg"
            mt={4}
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default Login;
