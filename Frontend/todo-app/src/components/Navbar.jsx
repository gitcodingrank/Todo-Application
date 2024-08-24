import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Heading,
  Button,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useBreakpointValue
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login'; // Redirect to login page
  };

  const navLinks = (
    <Flex
      direction={{ base: 'row', md: 'row' }}
      align="center"
      justify="center"
      mt={{ base: 4, md: 0 }}
      spacing={4}
    >
      <Link to="/">
        <Button colorScheme="teal" variant="link" mx={2}>
          Home
        </Button>
      </Link>
      <Link to="/completed">
        <Button colorScheme="teal" variant="link" mx={2}>
          Completed
        </Button>
      </Link>
      {isAuthenticated ? (
        <Button colorScheme="teal" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <>
          <Link to="/login">
            <Button colorScheme="teal" mx={2}>
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button colorScheme="teal" mx={2}>
              Register
            </Button>
          </Link>
        </>
      )}
    </Flex>
  );

  return (
    <Box
      bg="teal.500"
      color="white"
      p={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000} // Ensure it stays above other content
    >
      <Flex justify="space-between" align="center">
        <Heading size={useBreakpointValue({ base: 'sm', md: 'md' })}>Todo App</Heading>
        <Flex display={{ base: 'none', md: 'flex' }} ml="auto">
          {navLinks}
        </Flex>
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
        />
      </Flex>

      <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Box >
              {navLinks}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
