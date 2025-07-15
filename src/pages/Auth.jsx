import React from 'react'
import './auth.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {  Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const nav=useNavigate()
    
    const handleLogin = () => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedPassword = localStorage.getItem('userPassword');
    
        if (email === storedEmail && password === storedPassword) {
        //   alert('✅ Login successful!');
          toast.success(' Login successful!')
          nav('/home')
        } else {
          alert('❌ Invalid email or password');
        }
      };
    
  return (
<>

<div className='d-flex justify-content-center align-items-center container-fluid' style={{ height: '100vh' }}>
      <div className='w-100 w-md-75 border rounded-4 shadow-lg p-4 p-md-5 bg-light' >
        <Row className='g-4' style={{backgroundColor:'white'}}>
          <Col md={6} className='d-none d-md-flex align-items-center justify-content-center'>
            <img className='img-fluid rounded-3'  src="https://img.freepik.com/free-photo/doctor-presenting-something-isolated-white-background_1368-5834.jpg?t=st=1752338137~exp=1752341737~hmac=1bcb993522982d3f25312c018bd247d015a868768dde3a4ba1d729c77064302d&w=826" alt="Doctor" />
          </Col>

          <Col xs={12} md={6} className='d-flex flex-column justify-content-center'>
            <div className="text-center mb-4">
              <h2 className='fw-bold'>Welcome Back</h2>
              <p className='text-muted'>Login to your account</p>
            </div>

            <input  onChange={e => setEmail(e.target.value)}  placeholder='Email' type="email"  className='form-control mb-3' />
            <input  onChange={e => setPassword(e.target.value)}  placeholder='Password'  type="password" className='form-control mb-4' />
            <button onClick={handleLogin} className='btn btn-success w-100'>
              LOGIN
            </button>
          </Col>
        </Row>
      </div>
    </div>


</>  )
}

export default Auth