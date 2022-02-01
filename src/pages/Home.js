import React, { useContext, useState } from 'react';
import { Navbar,Container, Card, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
export default function Home() {
  const {data, setData} = useContext(AuthContext)
  const history = useHistory()
  return(
    <div>
      <Navbar bg="primary" variant="dark">
        <Container>
        <Navbar.Brand>SensifyID JS SDK- React App</Navbar.Brand>
        </Container>
      </Navbar>
      <div className='p-2'>
      <Card>
        <Card.Header>
          <Button onClick={()=>history.goBack()} variant='light' size='sm'>Back to Tracking</Button>
          <Button onClick={()=>setData(null)} variant='danger' className='mx-4' size='sm'>Delete Data</Button>
        </Card.Header>
        <Card.Body className={`p-3`} >
          <Card.Title className='text-center'>Raw Tracking Data</Card.Title>
          <Card.Text style={{fontSize:12}} className='bg-light p-2 '>
            {JSON.stringify(data)}
          </Card.Text>
        </Card.Body>
      </Card>
      </div>
    </div>
  )
}
