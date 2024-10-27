import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, FormControl, FormHelperText, Grid, Link, InputAdornment, IconButton, InputLabel, OutlinedInput, Stack, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { signup } from 'actions/authActions';
import { useAuth } from 'middlewares/authContext';

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting,setSubmitting]= useState(false);
  const {login}=useAuth();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const steps = ['Personal Details', 'Address Details', 'Vehicle Details'];

  const validationSchemas = [
    Yup.object().shape({
      name: Yup.string().max(255).required('Name is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: Yup.string().max(255).required('Password is required')
    }),
    Yup.object().shape({
      address: Yup.string().max(255).required('Address is required'),
      district: Yup.string().max(255).required('District is required'),
      block: Yup.string().max(255).required('Block is required')
    }),
    Yup.object().shape({
      vehicleName: Yup.string().max(255).required('Vehicle Name is required'),
      vehicleNo: Yup.string().max(255).required('Vehicle No. is required'),
      vehicleType: Yup.string().max(255).required('Vehicle Type is required'),
      BMOH: Yup.string().max(255).required('BMOH is required')
    })
  ];

  const handleNext = (isValid, setSubmitting) => {
    if (isValid) {
      setStep((prev) => prev + 1);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <>
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          address: '',
          district: '',
          block: '',
          vehicleName: '',
          vehicleNo: '',
          vehicleType: '',
          BMOH: '',
          submit: null
        }}
        validationSchema={validationSchemas[step]}
        onSubmit={async (values) => {
          if (step === steps.length - 1) {
            console.log(values); // Final submission handling
            try{
              const response=await signup(values)
              login(response)

            }
            catch{
              console.error('Invalid')
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, isValid }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {step === 0 && (
                <>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name-signup">Name*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.name && errors.name)}
                        id="name-signup"
                        value={values.name}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                    </Stack>
                    {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                        id="email-signup"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="demo@company.com"
                      />
                    </Stack>
                    {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-signup">Password*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password-signup"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Stack>
                    {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                        </Grid>
                        <Grid item>
                          <Typography variant="subtitle1" fontSize="0.75rem">
                            {level?.label}
                          </Typography>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Grid>
                </>
              )}

              {step === 1 && (
                <>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="address-signup">Address*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.address && errors.address)}
                        id="address-signup"
                        value={values.address}
                        name="address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="123 Main St"
                      />
                    </Stack>
                    {touched.address && errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="district-signup">District*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.district && errors.district)}
                        id="district-signup"
                        value={values.district}
                        name="district"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="District Name"
                      />
                    </Stack>
                    {touched.district && errors.district && <FormHelperText error>{errors.district}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="block-signup">Block*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.block && errors.block)}
                        id="block-signup"
                        value={values.block}
                        name="block"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Block Name"
                      />
                    </Stack>
                    {touched.block && errors.block && <FormHelperText error>{errors.block}</FormHelperText>}
                  </Grid>
                </>
              )}

              {step === 2 && (
                <>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="vehicle-name-signup">Vehicle Name*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.vehicleName && errors.vehicleName)}
                        id="vehicle-name-signup"
                        value={values.vehicleName}
                        name="vehicleName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Toyota Corolla"
                      />
                    </Stack>
                    {touched.vehicleName && errors.vehicleName && <FormHelperText error>{errors.vehicleName}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="vehicle-no-signup">Vehicle No.*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.vehicleNo && errors.vehicleNo)}
                        id="vehicle-no-signup"
                        value={values.vehicleNo}
                        name="vehicleNo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="AB-1234"
                      />
                    </Stack>
                    {touched.vehicleNo && errors.vehicleNo && <FormHelperText error>{errors.vehicleNo}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="vehicle-type-signup">Vehicle Type*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.vehicleType && errors.vehicleType)}
                        id="vehicle-type-signup"
                        value={values.vehicleType}
                        name="vehicleType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Sedan"
                      />
                    </Stack>
                    {touched.vehicleType && errors.vehicleType && <FormHelperText error>{errors.vehicleType}</FormHelperText>}
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="BMOH-signup">BMOH*</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.BMOH && errors.BMOH)}
                        id="BMOH-signup"
                        value={values.BMOH}
                        name="BMOH"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="BMOH Name"
                      />
                    </Stack>
                    {touched.BMOH && errors.BMOH && <FormHelperText error>{errors.BMOH}</FormHelperText>}
                  </Grid>
                </>
              )}

              {/* Step control buttons */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  {step > 0 && (
                    <Button onClick={handleBack} variant="contained" color="secondary">
                      Back
                    </Button>
                  )}
                  {step < steps.length - 1 && (
                    <Button onClick={() => handleNext(isValid, setSubmitting)} variant="contained" color="primary">
                      Continue
                    </Button>
                  )}
                  {step === steps.length - 1 && (
                    <AnimateButton>
                      <Button fullWidth size="large" type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        Create Account
                      </Button>
                    </AnimateButton>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
