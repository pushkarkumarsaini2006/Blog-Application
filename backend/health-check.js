#!/usr/bin/env node

const axios = require('axios');

const BACKEND_URL = 'https://blog-application-54yd.onrender.com';
const FRONTEND_URL = 'https://blog-application-1-i0me.onrender.com';

console.log('🏥 Health Check Script');
console.log('======================');

async function checkBackend() {
  try {
    console.log('\n🔍 Checking Backend Health...');
    console.log(`URL: ${BACKEND_URL}/health`);
    
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 10000
    });
    
    console.log('✅ Backend Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('❌ Backend Health Check Failed:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return false;
  }
}

async function checkAuth() {
  try {
    console.log('\n🔐 Testing Auth Endpoint...');
    console.log(`URL: ${BACKEND_URL}/api/auth/profile`);
    
    const response = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
      timeout: 10000,
      validateStatus: (status) => status < 500 // Accept 4xx errors as valid responses
    });
    
    if (response.status === 401) {
      console.log('✅ Auth endpoint working (401 expected without token)');
      return true;
    }
    
    console.log('📊 Auth Response:', response.status, response.data);
    return true;
    
  } catch (error) {
    console.log('❌ Auth Endpoint Check Failed:');
    console.log('Error:', error.message);
    return false;
  }
}

async function testRegistration() {
  try {
    console.log('\n👤 Testing Registration Endpoint...');
    
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    };
    
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, testUser, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Registration Successful!');
    console.log('Status:', response.status);
    console.log('User ID:', response.data._id);
    console.log('Token received:', !!response.data.token);
    
    return true;
  } catch (error) {
    console.log('❌ Registration Test Failed:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    return false;
  }
}

async function runHealthCheck() {
  console.log(`🕐 ${new Date().toISOString()}`);
  
  const backendOk = await checkBackend();
  const authOk = await checkAuth();
  const regOk = await testRegistration();
  
  console.log('\n📊 Summary:');
  console.log('==========');
  console.log(`Backend Health: ${backendOk ? '✅' : '❌'}`);
  console.log(`Auth Endpoint: ${authOk ? '✅' : '❌'}`);
  console.log(`Registration: ${regOk ? '✅' : '❌'}`);
  
  if (backendOk && authOk) {
    console.log('\n🎉 Backend is working properly!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some issues detected. Check logs above.');
    process.exit(1);
  }
}

runHealthCheck();
