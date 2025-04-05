import Stepper, { Step } from '../components/UI';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Checkbox } from 'antd';


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
  <Step>
    <h2>Let's Start With Best Prescription Reader </h2>
    <img style={{ height: '100px', width: '100%', objectFit: 'cover', objectPosition: 'center -70px', borderRadius: '15px', marginTop: '1em' }} src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894" />

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