
import React from 'react';
import { CustomerTable } from './components/CustomerTable';

function Home() {
  return <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
  }}>
    <h1>Welcome to react router dom and Query!</h1>
    <CustomerTable />
  </div>;
}

export default Home;
  