// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';

// project import
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Typography from 'themes/typography';

// project import

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
        <p>Devloped</p>
    </Box>
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
