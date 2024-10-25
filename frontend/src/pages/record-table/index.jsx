import React from 'react';
import Container from '@mui/material/Container';
import TableRecords from './App';
import { useLocation, useParams } from 'react-router';

export default function History() {

  const {timegroup}=useParams()
  const location = useLocation();
  const { editable } = location.state || {editable:false}; // Destructure the state
  return (
    <>
      <TableRecords timegroup={timegroup} editable={editable}/>
    </>
  );
}
