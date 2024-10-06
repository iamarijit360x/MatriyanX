import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Tabs, Tab, Grid } from '@mui/material';

export default function AccountSettings() {
  const [formData, setFormData] = useState({
    name: '',
    vehicle_name: '',
    vehicle_type: '',
    district: '',
    block: '',
    bmmoh_email: '',
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
    <Container >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginTop: 4 }}>
        Account Settings
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: 3 }}>
        <Tab label="Basic Info" />
        <Tab label="Plans & Billing" />
        <Tab label="Team" />
        <Tab label="Appearance" />
        <Tab label="Notifications" />
        <Tab label="Audit Trail" />
        <Tab label="Integrations" />
      </Tabs>

      {activeTab === 0 && (
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
              <TextField
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
              />
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

          <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 3 }}>
            Save
          </Button>
        </Box>
      )}
    </Container>
  );
}
