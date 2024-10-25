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
import { createPatient, getAllPatients } from 'actions/patientActions';
import axiosInstance from 'middlewares/axiosConfig';
import { getMonthYear } from 'utils/utils';
import Typography from '@mui/material/Typography';

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

export default function TableRecords({timegroup,editable}) {
  const [rows, setRows] = useState([{ ...defaultRow, isEditing: true }]); // Start with one editable row
  const [errors, setErrors] = useState(Array(rows.length).fill({}));
  const [error, setError] = useState(false);
  const totalAmount = rows.reduce((total, row) => total + parseFloat(row.amount) || 0, 0);
  const totalDistance= rows.reduce((total, row) => total + parseFloat(row.distance) || 0, 0);

  const [year, month] = timegroup.split('-').map(Number);  // Extract year and month
  const startDate = new Date(year, month-1);                 // Start of the month
  const endDate = new Date(year, month, 0);            // End of the month


  
  useEffect(() => {
    if(timegroup)
    getAllPatients(timegroup).then(data=>{setRows(data)})
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
  
    // Validation and conversion
    Object.keys(defaultRow).forEach(key => {
      if (row[key] === '' || (key === 'date' && row[key] === null)) {
        newErrors[key] = true;
        setError(true);
      } else {
        newErrors[key] = false;
  
        // Convert distance, voucher_number, and amount to integers
        if (['distance', 'voucher_number', 'amount','serial_no'].includes(key)) {
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
      setRows(newRows);
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
    
    const data=rows.filter(row=>!row.patient_id);
    if(data.length){
      await createPatient({patients:data,timegroup,total_amount:totalAmount,total_distance:totalDistance})
      getAllPatients(timegroup).then(data=>{setRows(data)})
    }
  };

  const villageOptions = ['Village A', 'Village B', 'Village C', 'Village D'];
  console.log(JSON.stringify(getMonthYear(timegroup)));
  
  return (
    <>
      <Typography sx={{textAlign:'center',paddingBlockEnd:'2%'}} variant="h3" color="textPrimary">Patients Data for {getMonthYear(timegroup)}</Typography>
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
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
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
        </Button></>}
    </>
  );
}
