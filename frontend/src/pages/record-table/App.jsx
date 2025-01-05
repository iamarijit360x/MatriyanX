import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField,
  Button, Select, MenuItem, IconButton,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import MonthYearPopup from './CreateRecord';
import { createPatient, deletePatient, editPatient, getAllPatients } from 'actions/patientActions';
import axiosInstance from 'middlewares/axiosConfig';
import { getMonthYear } from 'utils/utils';
import Typography from '@mui/material/Typography';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const defaultRow = {
  serial_no: '1',
  name: '',
  voucher_type: '',
  voucher_number: '',
  district: 'Burdwan',
  village: '',
  distance: '',
  date: new Date(),
  amount: '0'
};

export default function TableRecords({ timegroup, editable }) {
  const [rows, setRows] = useState([{ ...defaultRow, isEditing: true }]); // Start with one editable row
  const [originalRows, setOriginalRows] = useState([]); // Keep a copy of the original data for comparison
  const [errors, setErrors] = useState(Array(rows.length).fill({}));
  const [error, setError] = useState(false);
  const totalAmount = rows.reduce((total, row) => total + parseFloat(row.amount) || 0, 0);
  const totalDistance = rows.reduce((total, row) => total + parseFloat(row.distance) || 0, 0);
  const [year, month] = timegroup.split('-').map(Number);  // Extract year and month
  const startDate = new Date(year, month - 1);                 // Start of the month
  const endDate = new Date(year, month, 0);            // End of the month
  const [open, setOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [openQuickUpload, setOpenQuickUpload] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Function to handle opening and closing the Quick Upload dialog
  const handleOpenQuickUpload = () => setOpenQuickUpload(true);
  const handleCloseQuickUpload = () => {
    setOpenQuickUpload(false);
    setJsonInput('');  // Clear input after closing
  };

  // Function to parse and add pasted JSON data
  const handleAddQuickUpload = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      console.log(parsedData);
      // Check if parsed data is an array and each item has the required keys
      // if (!Array.isArray(parsedData) || parsedData.some(item => !item.name || !item.village || !item.token || !item.distance || !item.date || !item.amount)) {
      //   throw new Error('Invalid data format');
      // }
      const maxVoucherNumber = rows.length > 0 ? Math.max(...rows.map(row => row.voucher_number || 0)) : 0;

      // Format each item and calculate `amount` if needed
      const newRows = parsedData.map((item, index) => ({
        serial_no: rows.length + index + 1, // Serial number for each row
        name: item.name,
        village: item.village,
        voucher_type:`V${item.voucher_type}`, // Assuming token corresponds to `voucher_type`
        voucher_number: maxVoucherNumber+index+1, // Generate a voucher number
        district: 'Burdwan', // Assuming default district
        distance: item.distance,
        date: new Date(format(new Date(item.date), 'MM/dd/yyyy')), // Format date to a JS Date object
        amount: item.amount,
        isEditing: false,
      }));

      setRows([...rows, ...newRows]);  // Append the new rows to the existing ones
      handleCloseQuickUpload();  // Close the dialog after uploading
    } catch (error) {
      console.error('Invalid JSON format', error);
      alert('Please paste a valid JSON array of patient objects.');
    }
  };
  const handleOpenDialog = (index) => {
      setDeleteIndex(index);
      setOpen(true);
  };

  const handleCloseDialog = () => {
      setOpen(false);
      setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
      if (deleteIndex !== null) {
          handleDeleteRow(deleteIndex);
      }
      handleCloseDialog();
  };
  const fetchAndSetAllPatients = () => {
    getAllPatients(timegroup).then((data) => {
      setRows(data);
      setOriginalRows(data); // Initialize original rows
    });
  }

  useEffect(() => {
    if (timegroup) {
      fetchAndSetAllPatients();
    }
  }, []);


  const calculateAmount = (distance) => {
    let amount = 0;
    switch (true) {
      case distance > 55:
        amount = distance * 8;
        break;
      case distance > 30:
        amount = 450;
        break;
      case distance > 20:
        amount = 350;
        break;
      case distance > 10:
        amount = 250;
        break;
      case distance > 0:
        amount = 150;
        break;
      default:
        amount = 0;
    }
    return amount.toFixed(2);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = rows.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [name]: value };
        if (name === 'distance') {
          updatedRow.amount = calculateAmount(updatedRow.distance);
        }
        return updatedRow;
      }
      return row;
    });
    setRows(newRows);
  };

  const handleDateChange = (index, newDate) => {
    const newRows = rows.map((row, i) => (i === index ? { ...row, date: newDate } : row));
    setRows(newRows);
  };

  const handleAddRow = () => {
    const newSerialNo = rows.length > 0 ? Math.max(...rows.map(row => row.serial_no)) + 1 : 1;
    const newVoucherNumber = rows.length > 0 ? Math.max(...rows.map(row => parseInt(row.voucher_number, 10))) + 1 : 1;
    setRows([...rows, { ...defaultRow, serial_no: newSerialNo, voucher_number: newVoucherNumber, isEditing: true }]);
  };

  const handleDeleteRow = async (index) => {
 
    if(!!rows[index].patient_id){

      
      await deletePatient(rows[index].patient_id,timegroup);
      fetchAndSetAllPatients()

    }
    else setRows(rows.filter((_, i) => i !== index));
   
  };

  const handleEditRow = (index) => {
    const newRows = rows.map((row, i) => (i === index ? { ...row, isEditing: true } : row));
    setRows(newRows);
  };

  function deepEqual(obj1, obj2) {
    // Check if both values are identical
    if (obj1 === obj2) return true;

    // Check if both values are objects
    if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    // Get keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if they have the same number of keys
    if (keys1.length !== keys2.length) return false;

    // Check if all keys and values are equal
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

function hasChanged(obj1, obj2) {
    // Remove 'isEditing' key from obj1 if it exists
    const { isEditing, ...filteredObj1 } = obj1;

    // Use deepEqual to compare filtered obj1 with obj2
    return !deepEqual(filteredObj1, obj2);
}


  const handleSaveRow = async (index) => {
    const row = rows[index];
    const newErrors = { ...errors[index] };
    const isExisting = !!row.patient_id;

    // Validation and conversion
    Object.keys(defaultRow).forEach(key => {
      if (row[key] === '' || (key === 'date' && row[key] === null)) {
        newErrors[key] = true;
        setError(true);
      } else {
        newErrors[key] = false;

        // Convert distance, voucher_number, and amount to integers
        if (['distance', 'voucher_number', 'amount', 'serial_no'].includes(key)) {
          row[key] = parseInt(row[key], 10);
        }
      }
    });

    const updatedErrors = [...errors];
    updatedErrors[index] = newErrors;
    setErrors(updatedErrors);

    if (Object.values(newErrors).every(err => !err)) {
      setError(false);
      const newRows = rows.map((row, i) => (i === index ? { ...row, isEditing: false } : row));
      console.log(newRows)
      setRows(newRows);
      if (isExisting && hasChanged(newRows[index],originalRows[index])) {
        await editPatient({ patient: row, total_amount: totalAmount, total_distance: totalDistance, time_group: timegroup });
        fetchAndSetAllPatients();
      }
    }
  };

  const handleSaveAll = async () => {
    rows.forEach((_, index) => {
      handleSaveRow(index);
    });
    if (error) {
      console.log('ERROR');
      return;
    }

    const data = rows.filter(row => !row.patient_id);
    if (data.length) {
      await createPatient({ patients: data, timegroup, total_amount: totalAmount, total_distance: totalDistance })
      fetchAndSetAllPatients();
    }
  };

  const villageOptions = ['Village A', 'Village B', 'Village C', 'Village D'];

  return (
    <>
      <Typography sx={{ textAlign: 'center', paddingBlockEnd: '2%' }} variant="h3" color="textPrimary">Patients Data for {getMonthYear(timegroup)}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Sl No', 'Name', 'Voucher Type', 'Voucher No', 'District', 'Village', 'Distance', 'Date', 'Amount', ...[editable && 'actions']].map(header => (
                <TableCell key={header} sx={{ textAlign: 'center' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} >
                
                {Object.keys(defaultRow).map((key) => (
                  <TableCell key={key} sx={{ padding: '5px', textAlign: 'center', borderColor: row?.patient_id ? '' : 'yellow' }}>
                    
                    {row.isEditing ? (
                      key === 'voucher_type' ? (
                        <Select
                          error={errors[index]?.[key]}
                          size='small'
                          value={row.voucher_type}
                          name="voucher_type"
                          onChange={(event) => handleInputChange(index, event)}
                          fullWidth
                        >
                          <MenuItem value="V1">V1</MenuItem>
                          <MenuItem value="V2">V2</MenuItem>
                          <MenuItem value="V3">V3</MenuItem>
                        </Select>
                      ) : key === 'village' ? (
                        <Autocomplete
                          options={villageOptions}
                          value={row.village}
                          onChange={(event, newValue) => {
                            const newRows = [...rows];
                            newRows[index].village = newValue || '';
                            setRows(newRows);
                          }}
                          renderInput={(params) => (
                            <TextField
                              error={errors[index]?.[key]}
                              {...params}
                              size="small"
                              placeholder="Select Village"
                              fullWidth
                            />
                          )}
                        />
                      ) : key === 'date' ? (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            inputFormat="dd-MM-yyyy"
                            value={row.date}
                            minDate={startDate}         // Set min date
                            maxDate={endDate}           // Set max date
                            onChange={(date) => handleDateChange(index, date)}
                            renderInput={(params) => (
                              <TextField
                                error={errors[index]?.date}
                                size="small"
                                fullWidth
                                {...params}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      ) : (
                        <TextField
                          value={row[key]}
                          placeholder={key}
                          name={key}
                          disabled={key === 'amount' || key === 'serial_no'}
                          size='small'
                          onChange={(event) => handleInputChange(index, event)}
                          error={errors[index]?.[key]}
                          fullWidth
                          {...(key === 'distance' && {
                            onInput: (e) => {
                              e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                              const parts = e.target.value.split('.');
                              if (parts.length > 2) {
                                e.target.value = parts[0] + '.' + parts[1];
                              }
                            },
                          })}
                        />
                      )
                    ) : (
                      row[key] ? (
                        key === 'date' ? format(new Date(row[key]), 'dd-MM-yyyy') : row[key]
                      ) : (
                        <span style={{ color: '#999' }}>{`Enter ${key}`}</span>
                      )
                    )}
                  </TableCell>
                ))}
                {editable && <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                  {row.isEditing ? (
                    <IconButton onClick={() => handleSaveRow(index)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditRow(index)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  {/* <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton> */}
                  <React.Fragment>
                    <IconButton onClick={() => handleOpenDialog(index)}>
                      <DeleteIcon />
                    </IconButton>
                    <Dialog
                      open={open}
                      onClose={()=>setOpen(false)}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title">
                        {" Are you sure you want to delete this row? This action cannot be undone."}
                      </DialogTitle>
                      <DialogContent>
                  
                      </DialogContent>
                      <DialogActions>
                        <Button autoFocus onClick={()=>setOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={()=>{handleDeleteRow(deleteIndex);setOpen(false)}} autoFocus>
                          Delete 
                        </Button>
                      </DialogActions>
                    </Dialog>
                </React.Fragment>
                </TableCell>}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: 'right', fontWeight: 'bold' }}>Total Amount:</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{totalAmount.toFixed(2)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {editable &&
        <>
          <Button onClick={handleAddRow} startIcon={<AddIcon />} sx={{ marginTop: '10px' }}>
            Add Patient
          </Button><Button onClick={handleSaveAll} sx={{ marginTop: '10px', marginLeft: '10px' }}>
            Save All
          </Button>
          <Button onClick={handleOpenQuickUpload} startIcon={<AddIcon />} sx={{ marginTop: '10px' }}>
        Quick Upload
      </Button>

      {/* Quick Upload Dialog */}
      <Dialog open={openQuickUpload} onClose={handleCloseQuickUpload} maxWidth="md" fullWidth>
  <DialogTitle>Quick Upload Patients</DialogTitle>
  <DialogContent>
    <TextField
      label="Paste JSON array here"
      placeholder='e.g., [{"name": "Deepali Lohar", "village": "Morsidpur", "token": "1", "distance": 22, "date": "1-8-24", "amount": 350.00}]'
      multiline
      rows={10}  // Increase the number of rows
      fullWidth
      variant="outlined"
      value={jsonInput}
      onChange={(e) => setJsonInput(e.target.value)}
      sx={{
        width: '100%',   // Full width of the dialog
        height: '300px', // Custom height
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseQuickUpload} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleAddQuickUpload} color="primary">
      Upload
    </Button>
  </DialogActions>
</Dialog>

          </>}
    </>
  );
}
