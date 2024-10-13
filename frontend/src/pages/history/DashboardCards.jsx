import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { getAllSummaris } from 'actions/summaryActions';



export default function DashboardCards() {
  const [data,setData] = useState([
    {
      id: 1,
      yearMonth: '2024-10',
      totalPatients: 120,
      totalAmount: '$12,000',
      totalDistance: '150 km',
      status: 'Completed'
    },
    {
      id: 2,
      yearMonth: '2024-09',
      totalPatients: 100,
      totalAmount: '$10,000',
      totalDistance: '120 km',
      status: 'Pending'
    },
    {
      id: 3,
      yearMonth: '2024-08',
      totalPatients: 95,
      totalAmount: '$9,500',
      totalDistance: '130 km',
      status: 'Completed'
    }
  ]);
  useEffect(()=>{
    const summarries=getAllSummaris()
    console.log(summarries);
    
  },[])
  return (
    <Stack spacing={3} sx={{width:'80%'}}>
      {data.map((item) => (
        <Card key={item.id} sx={{ boxShadow: 3, padding: 2, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>SL-{String(item.id).padStart(5, '0')}</Typography>
              <Typography variant="body2" color="text.secondary">
                Created 1 minute ago
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total {item.totalAmount}
              </Typography>
            </Box>
          </Box>
          <Box mt={2} mb={2}>
            <Typography variant="body2">
              {item.yearMonth
              }
            </Typography>
          </Box>

          <Grid container spacing={1} mt={2}>
            <Grid item>
              <Button variant="outlined">Edit</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Download</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Send</Button>
            </Grid>
            {/* <Grid item>
              <Button variant="outlined">Client</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Payment</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Archive</Button>
            </Grid> */}
          </Grid>
        </Card>
      ))}
    </Stack>
  );
}
