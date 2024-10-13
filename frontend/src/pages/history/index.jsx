import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DashboardCards from './DashboardCards';
import { useAuth } from 'middlewares/authContext';
import MonthYearPopup from 'pages/record-table/CreateRecord';

export default function History() {
  
  return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 4,
          paddingBottom: 4,
          gap: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Monthly Overview
        </Typography>
        <MonthYearPopup/>

        <Typography variant="subtitle1" gutterBottom sx={{ color: '#757575', marginBottom: 3 }}>
          A summary of patient visits, total amounts, and travel distance for each month.
        </Typography>
        <DashboardCards/>
     </Box>
  );
}
