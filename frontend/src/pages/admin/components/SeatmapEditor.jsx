import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Alert,
  Stack,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';
import { useTranslation } from '../../../context/I18nContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Seatmap Editor Component - designed to follow react-seatmap-creator structure
const SeatmapEditor = ({ seatmap, onUpdate, theaterName }) => {
  const { t } = useTranslation();

  // State equivalent to useCreatorPage hook
  const [seatMapData, setSeatMapData] = useState({
    id: 'theater-seatmap',
    name: theaterName || 'Theater Seatmap',
    venueId: 1,
    venueName: theaterName || 'Theater',
    blockId: 1,
    blockName: 'Block A',
    stageText: 'STAGE'
  });
  const [seatData, setSeatData] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    mouseX: null,
    mouseY: null,
    row: null,
    seat: null
  });

  // Initialize from seatmap prop
  useEffect(() => {
    if (seatmap) {
      if (seatmap.rows) {
        // Handle new seatmap format {name, stageText, rows: [{name, seats}]}
        const newSeatData = new Map();
        seatmap.rows.forEach(row => {
          newSeatData.set(row.name, row.seats || []);
        });
        setSeatData(newSeatData);

        // Update seatMapData with name and stageText if available
        setSeatMapData(prev => ({
          ...prev,
          name: seatmap.name || prev.name,
          stageText: seatmap.stageText || prev.stageText
        }));
      } else if (Array.isArray(seatmap)) {
        // Handle legacy seatmap format [{row: A, seats: [...]}]
        const newSeatData = new Map();
        seatmap.forEach((row, index) => {
          const rowName = row.row || row.name || String.fromCharCode(65 + index);
          newSeatData.set(rowName, row.seats || []);
        });
        setSeatData(newSeatData);
      } else {
        setSeatData(new Map());
      }
    } else {
      // Initialize with default rows if no seatmap
      const defaultSeatData = new Map();
      defaultSeatData.set('A', Array(10).fill(null).map((_, i) => createSeat('A', (i + 1).toString())));
      defaultSeatData.set('B', Array(10).fill(null).map((_, i) => createSeat('B', (i + 1).toString())));
      setSeatData(defaultSeatData);
    }
  }, [seatmap]);

  // Define seat types based on backend model
  const seatTypes = [
    { name: 'standard', label: 'Standard', color: '#4CAF50' },
    { name: 'double', label: 'Double', color: '#2196F3' },
    { name: 'vip', label: 'VIP', color: '#FF9800' },
    { name: 'space', label: 'Space', color: '#BDBDBD' }
  ];

  // Create a new seat object
  const createSeat = (row, label, type = 'standard') => ({
    id: `${row}${label}`,
    row,
    label: label.toString(),
    type: type
  });

  // Get rows from seatData Map
  const rows = useMemo(() => Array.from(seatData.entries()), [seatData]);

  // Get total seats count
  const getTotalSeats = useCallback(() => {
    let count = 0;
    seatData.forEach(seats => {
      count += seats.filter(seat => seat.type === 'seat').length;
    });
    return count;
  }, [seatData]);

  // Add a new empty row
  const addEmptyRow = () => {
    if (rows.length >= 26) {
      setError(t('admin.seatmapEditor.maxRowsReached'));
      return;
    }

    const nextRowName = String.fromCharCode(65 + rows.length);
    setSeatData(prev => {
      const newMap = new Map(prev);
      newMap.set(nextRowName, [{ id: `${nextRowName}-1`, row: nextRowName, label: '0', type: 'space' }]);
      return newMap;
    });
    setError('');
  };

  // Add a new seated row
  const addSeatedRow = (rowName) => {
    if (rows.length >= 26) {
      setError(t('admin.seatmapEditor.maxRowsReached'));
      return false;
    }

    if (seatData.has(rowName)) {
      setError(t('admin.seatmapEditor.rowNameExists'));
      return false;
    }

    setSeatData(prev => {
      const newMap = new Map(prev);
      newMap.set(rowName, [{ id: `${rowName}-1`, row: rowName, label: '1', type: 'seat' }]);
      return newMap;
    });
    setError('');
    return true;
  };

  // Delete a row
  const deleteRow = (rowId) => {
    if (seatData.size <= 1) {
      setError(t('admin.seatmapEditor.minRowsReached'));
      return;
    }
    setSeatData(prev => {
      const newMap = new Map(prev);
      newMap.delete(rowId);
      return newMap;
    });
    setError('');
  };

  // Add seat to a row
  const addSeat = (rowId, seatId, type, direction) => {
    setSeatData(prev => {
      const newMap = new Map(prev);
      const seatsInRow = newMap.get(rowId) || [];
      const seatIndex = seatsInRow.findIndex(seat => seat.id === seatId);

      if (seatIndex !== -1) {
        // Generate new label for seat
        let newLabel;
        if (type !== 'space') {
          // Get the highest current seat number in the row and increment it
          const existingSeatNumbers = seatsInRow
            .filter(seat => seat.type !== 'space')
            .map(seat => parseInt(seat.label) || 0);
          const maxNumber = existingSeatNumbers.length > 0 ? Math.max(...existingSeatNumbers) : 0;
          newLabel = (maxNumber + 1).toString();
        } else {
          newLabel = '0';
        }

        const newSeat = {
          id: `${rowId}-${Date.now()}`,
          row: rowId,
          label: newLabel,
          type: type
        };

        const insertIndex = direction === 'right' ? seatIndex + 1 : seatIndex;
        const updatedSeats = [...seatsInRow];
        updatedSeats.splice(insertIndex, 0, newSeat);
        newMap.set(rowId, updatedSeats);
      }

      return newMap;
    });
  };

  // Change seat type
  const changeSeatType = (rowId, seatId, newType) => {
    setSeatData(prev => {
      const newMap = new Map(prev);
      const seatsInRow = newMap.get(rowId) || [];

      const updatedSeats = seatsInRow.map(seat =>
        seat.id === seatId ? { ...seat, type: newType } : seat
      );

      newMap.set(rowId, updatedSeats);
      return newMap;
    });
  };

  // Remove seat from a row
  const deleteSeat = (rowId, seatId) => {
    setSeatData(prev => {
      const newMap = new Map(prev);
      const seatsInRow = newMap.get(rowId) || [];
      const newSeats = seatsInRow.filter(seat => seat.id !== seatId);

      if (newSeats.length === 0) {
        // Don't delete the last seat in a row
        return prev;
      }

      newMap.set(rowId, newSeats);
      return newMap;
    });
  };

  // Update a seat's label
  const editSeatName = (rowId, seatId, name) => {
    if (!name || name.trim() === '') return;

    setSeatData(prev => {
      const newMap = new Map(prev);
      const seatsInRow = newMap.get(rowId) || [];

      const seatExists = seatsInRow.some(seat => seat.label === name && seat.id !== seatId);
      if (seatExists) {
        setError(t('admin.seatmapEditor.seatNameExists', { name }));
        return prev;
      }

      const updatedSeats = seatsInRow.map(seat =>
        seat.id === seatId ? { ...seat, label: name } : seat
      );
      newMap.set(rowId, updatedSeats);
      return newMap;
    });
  };

  // Update a row's name
  const editRowName = (oldRowName, newRowName) => {
    if (!newRowName.trim()) {
      setError(t('admin.seatmapEditor.rowNameRequired'));
      return;
    }

    if (seatData.has(newRowName) && oldRowName !== newRowName) {
      setError(t('admin.seatmapEditor.rowNameExists'));
      return;
    }

    setSeatData(prev => {
      const newMap = new Map(prev);
      const seats = newMap.get(oldRowName);
      if (seats) {
        // Update the row name in all seats
        const updatedSeats = seats.map(seat => ({ ...seat, row: newRowName }));

        // Remove old row and add new row with new name
        newMap.delete(oldRowName);
        newMap.set(newRowName, updatedSeats);
      }
      return newMap;
    });
    setError('');
  };

  // Edit seat map name
  const editMapName = (newName) => {
    setSeatMapData(prev => ({ ...prev, name: newName }));
  };

  // Edit stage name
  const editStageName = (newName) => {
    setSeatMapData(prev => ({ ...prev, stageText: newName }));
  };

  // Save data function
  const saveData = () => {
    const updatedSeatmap = {
      name: seatMapData.name,
      stageText: seatMapData.stageText,
      rows: Array.from(seatData.entries()).map(([rowName, seats]) => ({
        name: rowName,
        seats: seats
      }))
    };
    if (onUpdate) {
      onUpdate(updatedSeatmap);
    }
    setError('');
  };

  // Reset to initial state
  const resetData = () => {
    const defaultSeatData = new Map();
    defaultSeatData.set('A', Array(10).fill(null).map((_, i) => createSeat('A', (i + 1).toString())));
    defaultSeatData.set('B', Array(10).fill(null).map((_, i) => createSeat('B', (i + 1).toString())));
    setSeatData(defaultSeatData);
    setSeatMapData(prev => ({ ...prev, stageText: 'STAGE', name: theaterName || 'Theater Seatmap' }));
    setError('');
  };

  // Reorder rows
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(seatData.entries());
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newMap = new Map(items);
    setSeatData(newMap);
  };

  // Handle context menu
  const handleContextMenu = (event, row, seat) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      row,
      seat
    });
  };

  // Close context menu
  const handleClose = () => {
    setContextMenu({ mouseX: null, mouseY: null, row: null, seat: null });
  };

  // Render the seatmap editor interface
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {seatMapData.name || 'Seatmap Editor'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mx: 'auto', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, py: 1, bgcolor: '#7a0404', color: 'white', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ letterSpacing: '20px' }}>
            {seatMapData.stageText || 'STAGE'}
          </Typography>
        </Box>

        {/* Visual seatmap representation */}
        <Box sx={{
          overflow: 'auto',
          minHeight: 500,
          p: 2,
          border: '1px solid #ddd',
          borderRadius: 1,
          maxWidth: '100%',
          mx: 'auto',
          position: 'relative'
        }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='rows' direction='vertical'>
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                  {rows?.map(([row, seatsInRow], index) => (
                    <Draggable key={row} index={index} draggableId={row}>
                      {(draggableProvided, snapshot) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          style={{
                            ...draggableProvided.draggableProps.style,
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: '50px',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              mr: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {row}
                          </Box>
                          <IconButton
                            {...draggableProvided.dragHandleProps}
                            size="small"
                            sx={{ mr: 1, color: '#777' }}
                          >
                            <DragIcon />
                          </IconButton>
                          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, flex: 1 }}>
                            {seatsInRow?.map((seat) => {
                              const seatTypeConfig = seatTypes.find(st => st.name === seat.type) || seatTypes[0];
                              return (
                                <Box
                                  key={seat.id}
                                  sx={{
                                    width: 35,
                                    height: 35,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    border: seat.type === 'space' ? '1px solid transparent' : '1px solid #222',
                                    borderBottom: seat.type === 'space' ? '1px solid transparent' : '5px solid #222',
                                    borderRadius: '5px',
                                    backgroundColor: seatTypeConfig.color,
                                    color: seat.type === 'space' ? '#666' : '#fff',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      opacity: 0.8
                                    }
                                  }}
                                  onContextMenu={(e) => handleContextMenu(e, row, seat)}
                                >
                                  {seat.type !== 'space' ? seat.label : ''}
                                </Box>
                              );
                            })}
                          </Box>
                          <Box sx={{ ml: 1, display: 'flex', gap: 0.5 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => addSeat(row, seatsInRow[seatsInRow.length - 1]?.id || '', 'seat', 'right')}
                              startIcon={<AddIcon />}
                              sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                            >
                              <AddIcon fontSize="small" />
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => deleteRow(row)}
                              startIcon={<DeleteIcon />}
                              color="error"
                              sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                const newName = prompt('Enter new row name:', row);
                                if (newName) editRowName(row, newName);
                              }}
                              startIcon={<EditIcon />}
                              sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </Button>
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        {/* Seat Type Legend */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
          p: 2,
          bgcolor: '#f5f5f5',
          borderRadius: 1
        }}>
          <Typography variant="subtitle2" sx={{ mr: 2 }}>Seat Types:</Typography>
          {seatTypes.map((seatType) => (
            <Box key={seatType.name} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                  borderRadius: '3px',
                  backgroundColor: seatType.color
                }}
              />
              <Typography variant="body2">{seatType.label}</Typography>
            </Box>
          ))}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={addEmptyRow}
            startIcon={<AddIcon />}
          >
            Add Empty Row
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const newRowName = prompt('Enter row name:');
              if (newRowName) addSeatedRow(newRowName);
            }}
            startIcon={<AddIcon />}
          >
            Add Seated Row
          </Button>
          <Button
            variant="contained"
            onClick={saveData}
            startIcon={<SaveIcon />}
            color="success"
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            onClick={resetData}
            startIcon={<CancelIcon />}
          >
            Reset
          </Button>
          <Typography variant="body1" sx={{ ml: 'auto', alignSelf: 'center' }}>
            Total Seats: {getTotalSeats()}
          </Typography>
        </Stack>
      </Paper>

      {/* Context Menu */}
      <Menu
        open={contextMenu.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu.mouseY !== null && contextMenu.mouseX !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        onClick={handleClose}
      >
        <MenuItem onClick={() => {
          const newName = prompt('Enter new seat label:', contextMenu.seat?.label);
          if (newName) {
            editSeatName(contextMenu.row, contextMenu.seat?.id, newName);
          }
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('admin.seatmapEditor.editSeat')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          addSeat(contextMenu.row, contextMenu.seat?.id, 'standard', 'left');
        }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('admin.seatmapEditor.addSeatLeft')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          addSeat(contextMenu.row, contextMenu.seat?.id, 'standard', 'right');
        }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('admin.seatmapEditor.addSeatRight')}</ListItemText>
        </MenuItem>
        <MenuItem disabled sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold', fontSize: '0.875rem' }}>
          Change Seat Type
        </MenuItem>
        {seatTypes.map((seatType) => (
          <MenuItem
            key={seatType.name}
            onClick={() => changeSeatType(contextMenu.row, contextMenu.seat?.id, seatType.name)}
            selected={contextMenu.seat?.type === seatType.name}
          >
            <ListItemIcon>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '2px',
                  backgroundColor: seatType.color
                }}
              />
            </ListItemIcon>
            <ListItemText>{seatType.label}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => {
          deleteSeat(contextMenu.row, contextMenu.seat?.id);
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>{t('admin.seatmapEditor.deleteSeat')}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SeatmapEditor;