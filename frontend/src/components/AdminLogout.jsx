// components/AdminLogout.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const AdminLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button
      onClick={handleLogout}
      color="inherit"
      sx={{ color: 'white', '&:hover': { color: 'grey.300' } }}
    >
      Logout
    </Button>
  );
};

export default AdminLogout;