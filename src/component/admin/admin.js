import React, { useState } from 'react';
import { Card, Input, Button, Row, Progress, Modal } from 'antd';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomCard = ({ title }) => {
  const { email, setEmail } = useRole();
  const { visible, setvisible } = useRole();
  const [password, setPassword] = useState('');
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsEmailEntered(!!event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordEntered(!!event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      alert('Email and password are required.');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.post('http://localhost:4011/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        setvisible(true);
        setProgress(50);
        await axios.post('http://localhost:5000/send-otp', { email });
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          navigate('/otp');
        }, 500);
      } else {
        setLoading(false);
        alert('Wrong email or password');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <div className="card">
        <Row justify="center">
          <form onSubmit={handleSubmit} className="form-container">
            <Input
              className="textfield"
              value={email}
              onChange={handleEmailChange}
              placeholder={isEmailEntered ? '' : 'Enter your email'}
              style={{
                borderRadius: isEmailEntered ? '30px' : '0px',
                backgroundColor: isEmailEntered ? 'transparent' : 'aliceblue',
              }}
            />
            
            <Input.Password
              className="textfield"
              value={password}
              onChange={handlePasswordChange}
              placeholder={isPasswordEntered ? '' : 'Enter your password'}
              style={{
                borderRadius: isPasswordEntered ? '30px' : '0px',
                backgroundColor: isPasswordEntered ? 'transparent' : 'aliceblue',
                textAlign: 'center',
              }}
            />
            
            <Button type="primary" htmlType="submit" className="login-button">
              Submit
            </Button>
          </form>
        </Row>
      </div>

      <Modal
        visible={loading}
        closable={false}
        footer={null}
        centered
      >
        <Progress percent={progress} status="active" />
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {progress < 50 ? 'Logging in...' : 'Sending OTP...'}
        </p>
      </Modal>
    </div>
  );
};

export default CustomCard;