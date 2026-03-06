// pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/I18nContext';
import api from '../../services/api';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button
} from '@mui/material';
import {
  Delete,
  Add,
  Edit,
  VerifiedUser
} from '@mui/icons-material';
import UserFormModal from './components/UserFormModal';
import { Chip } from '@mui/material';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [userToVerify, setUserToVerify] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { t } = useTranslation();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(t('admin.users.fetchError'));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [t]);

  const handleAddClick = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setFormOpen(false);
      fetchUsers();
    } catch (err) {
      alert(t('admin.users.saveError'));
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      alert(t('admin.users.deleteError'));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleVerifyClick = (user) => {
    setUserToVerify(user);
    setVerifyDialogOpen(true);
  };

  const handleVerifyConfirm = async () => {
    if (!userToVerify) return;

    try {
      await api.put(`/users/${userToVerify.id}`, { ...userToVerify, isVerified: true });
      setUsers(users.map(user => 
        user.id === userToVerify.id ? { ...user, isVerified: true } : user
      ));
      setVerifyDialogOpen(false);
      setUserToVerify(null);
      alert(t('admin.users.verifySuccess'));
    } catch (err) {
      alert(t('admin.users.verifyError'));
      setVerifyDialogOpen(false);
      setUserToVerify(null);
    }
  };

  const handleVerifyCancel = () => {
    setVerifyDialogOpen(false);
    setUserToVerify(null);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{t('common.error')}: {error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('admin.users.title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          {t('admin.users.create')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={t('admin.users.table.ariaLabel')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.users.table.name')}</TableCell>
              <TableCell>{t('admin.users.table.email')}</TableCell>
              <TableCell>{t('admin.users.table.role')}</TableCell>
              <TableCell>{t('admin.users.table.phone')}</TableCell>
              <TableCell>{t('admin.users.table.loyaltyPoints')}</TableCell>
              <TableCell>{t('admin.users.table.isVerified')}</TableCell>
              <TableCell>{t('admin.users.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle1" fontWeight="medium">
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.loyaltyPoints}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isVerified ? t('admin.users.verified') : t('admin.users.unverified')}
                    color={user.isVerified ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!user.isVerified && (
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        startIcon={<VerifiedUser />}
                        onClick={() => handleVerifyClick(user)}
                      >
                        {t('admin.users.verify')}
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditClick(user)}
                    >
                      {t('admin.users.edit')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(user)}
                    >
                      {t('admin.users.delete')}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Form Modal */}
      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
      />

      {/* Verify Confirmation Dialog */}
      <Dialog
        open={verifyDialogOpen}
        onClose={handleVerifyCancel}
        aria-labelledby="verify-dialog-title"
      >
        <DialogTitle id="verify-dialog-title">
          {t('admin.users.verifyConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToVerify && `${t('admin.users.verifyMessage')} "${userToVerify.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerifyCancel} color="primary">
            {t('admin.users.cancel')}
          </Button>
          <Button onClick={handleVerifyConfirm} color="success" variant="contained">
            {t('admin.users.verify')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('admin.users.deleteConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {userToDelete && `${t('admin.users.deleteMessage')} "${userToDelete.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            {t('admin.users.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('admin.users.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;