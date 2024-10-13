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
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import MonthYearPopup from './CreateRecord';

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

export default function TableRecords({timegroup}) {
  const [rows, setRows] = useState([{ ...defaultRow, isEditing: true }]); // Start with one editable row
  const [errors, setErrors] = useState(Array(rows.length).fill({}));
  const [error, setError] = useState(false);
  const totalAmount = rows.reduce((total, row) => total + parseFloat(row.amount) || 0, 0);
  // useEffect(() => {
  //   axios.get('http://localhost:5000/patient?time_group=Morning', {
  //     headers: {
  //       'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhYmNAZ21haWwuY29tIiwiZXhwIjoxNzQxMDc2NDQxfQ.C_bIIkEZAoeoFZp-14VWQ8eKDeCEaPmOHVcrm8Dbb7E', // Replace with your actual token
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   .then((response) => {
  //     console.log(response.data);
  //     setRows(response.data)
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching data:', error);
  //   });
  // }, []);
  
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
    setRows([...rows, { ...defaultRow, serial_no: newSerialNo, isEditing: true }]);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleEditRow = (index) => {
    const newRows = rows.map((row, i) => (i === index ? { ...row, isEditing: true } : row));
    setRows(newRows);
  };

  const handleSaveRow = (index) => {
    const row = rows[index];
    const newErrors = { ...errors[index] };
    Object.keys(defaultRow).forEach(key => {
      if (row[key] === '' || (key === 'date' && row[key] === null)) {
        newErrors[key] = true;
        setError(true);
      } else {
        newErrors[key] = false;
      }
    });

    const updatedErrors = [...errors];
    updatedErrors[index] = newErrors;
    setErrors(updatedErrors);

    if (Object.values(newErrors).every(err => !err)) {
      setError(false);
      const newRows = rows.map((row, i) => (i === index ? { ...row, isEditing: false } : row));
      setRows(newRows);
    }
  };

  const handleSaveAll = () => {
    rows.forEach((_, index) => {
      handleSaveRow(index);
    });
    if (error) {
      console.log('ERROR');
      return;
    }
    
    const data=rows.filter(row=>!row.patient_id);
    console.log({patients:data,timegroup})
  };

  const villageOptions = ['Village A', 'Village B', 'Village C', 'Village D'];

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Sl No', 'Name', 'Voucher Type', 'Voucher No', 'District', 'Village', 'Distance', 'Date', 'Amount', 'Actions'].map(header => (
                <TableCell key={header} sx={{ textAlign: 'center' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(defaultRow).map((key) => (
                  <TableCell key={key} sx={{ padding: '5px', textAlign: 'center' }}>
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
                            value={row.date}
                            onChange={(date) => handleDateChange(index, date)}
                            renderInput={(params) => (
                              <TextField
                                error={errors[index]?.[key]}
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
                        key === 'date' ? new Date(row[key]).toLocaleDateString() : row[key]
                      ) : (
                        <span style={{ color: '#999' }}>{`Enter ${key}`}</span>
                      )
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                  {row.isEditing ? (
                    <IconButton onClick={() => handleSaveRow(index)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditRow(index)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
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
      <Button onClick={handleAddRow} startIcon={<AddIcon />} sx={{ marginTop: '10px' }}>
        Add Patient
      </Button>
      <Button onClick={handleSaveAll} sx={{ marginTop: '10px', marginLeft: '10px' }}>
        Save All
      </Button>
    </>
  );
}
