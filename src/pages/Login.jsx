import Stepper, { Step } from '../components/UI';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, message, Checkbox, Button } from 'antd';
import img from '../assets/drug.jpg'
import { FileTextOutlined } from '@ant-design/icons';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    console.log('Login Values:', values);
    setTimeout(() => {
      setLoading(false);
      message.success('Login successful!');
      navigate('/home');
    }, 1500);
  };

  return <>

<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center" href="/">
            <span className="bg-primary text-white rounded-circle p-2 me-2 d-inline-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
              <FileTextOutlined />
            </span>
            Pharmacology
          </a>
          <div className="ms-auto d-flex align-items-center">
            <Button
              type="text"
              className="me-2 fw-medium"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate('/register')}
              className="fw-medium"
            >
              Register
            </Button>
          </div>
        </div>
      </nav>
<Stepper
  initialStep={1}
  onStepChange={(step) => {
    console.log(step);
  }}
  onFinalStepCompleted={onFinish}
  backButtonText="Previous"
  nextButtonText="Next"
>
  <Step>
    <h2>Welcome Back To  Pharmacology!</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam perferendis iste neque dolor laborum optio!</p>
  </Step>

  <Step >
    <div className="">
  <h2 className='text-center'>Welcom Back</h2>
  <Form   onFinish={onFinish} loading={loading}  layout='vertical'>
      <Form.Item
      label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
        >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
      label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
        >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item name="remember" valuePropName="checked" label={null}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    </Form>
        </div>
  </Step>

</Stepper>

  </>

};

export default Login;