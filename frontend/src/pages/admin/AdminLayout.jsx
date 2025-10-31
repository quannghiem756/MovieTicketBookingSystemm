// pages/admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import useAdminAuth from '../../hooks/useAdminAuth';
import { Box } from '@mui/material';

const AdminLayout = () => {
  useAdminAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;