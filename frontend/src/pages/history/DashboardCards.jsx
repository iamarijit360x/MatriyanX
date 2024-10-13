import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { getAllSummaris } from 'actions/summaryActions';
import router from 'routes';
import { useNavigate } from 'react-router-dom';

export default function DashboardCards() {
  const [data,setData] = useState([]);
  const navigate=useNavigate()
  useEffect(()=>{
    getAllSummaris()
    .then((data)=> setData(data))
   
    
  },[])
  const getMonthYear = (dateString) => {
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <Stack spacing={3} sx={{width:'80%'}}>
      {data.map((item) => (
        <Card key={item.id} sx={{ boxShadow: 3, padding: 2, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {getMonthYear(item.time_group)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.status} 1 minute ago
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total {item.total_amount}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Distance {item.total_amount}
              </Typography>
            </Box>
          </Box>
          <Box mt={2} mb={2}>
            <Typography variant="body2">
              {item.status}
              
            </Typography>
          </Box>

          <Grid container spacing={1} mt={2}>
            <Grid item>
              <Button variant="outlined" onClick={()=>navigate(`/records/${item.time_group}`)}>Edit</Button>
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
