import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { generateSummaryReport, getAllSummaris } from 'actions/summaryActions';
import router from 'routes';
import { useNavigate } from 'react-router-dom';
import { getMonthYear } from 'utils/utils';

export default function DashboardCards() {
  const [data,setData] = useState([]);
  const navigate=useNavigate()
  useEffect(()=>{
    getAllSummaris()
    .then((data)=> setData(data))
   
    
  },[])


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
                Distance {item.total_distance} Km
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
              <Button variant="outlined" onClick={()=>navigate(`/records/${item.time_group}`, { state: { editable:item.status==='Created' } })}>{item.status==='Created'?'Edit':'View'}</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Download</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined">Send</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={()=>generateSummaryReport(item.time_group)}>Generate Report</Button>
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
