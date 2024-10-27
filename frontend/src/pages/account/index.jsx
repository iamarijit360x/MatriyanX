import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useAuth } from 'middlewares/authContext';

export default function AccountSettings() {
  const {account}=useAuth()
  console.log(account)
  const [formData, setFormData] = useState({
    name: account?.name,
    vehicle_name: account.vehicle_name,
    vehicle_type: account.vehicle_type,
    district: account.district,
    block: account.block,
    bmmoh_email: account.bmmoh_email,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log(formData);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginTop: 4 }}>
        Account Settings
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: '#f9f9f9', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Vehicle Name"
              name="vehicle_name"
              value={formData.vehicle_name}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Vehicle Type"
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>District</InputLabel>
              <Select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                label="District"
              >
                <MenuItem value="Burdwan">Burdwan</MenuItem>
                <MenuItem value="Hooghly">District 2</MenuItem>
                <MenuItem value="Howrah">District 3</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Block"
              name="block"
              value={formData.block}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="BMMOH Email"
              name="bmmoh_email"
              type="email"
              value={formData.bmmoh_email}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>

        {/* <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 3 }}>
          Save
        </Button> */}
      </Box>
    </Container>
  );
}
