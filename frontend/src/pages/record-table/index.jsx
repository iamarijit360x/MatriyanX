import React from 'react';
import Container from '@mui/material/Container';
import TableRecords from './App';
import { useParams } from 'react-router';

export default function History() {

  const {timegroup}=useParams()
  return (
    <>
      <TableRecords timegroup={timegroup}/>
    </>
  );
}
