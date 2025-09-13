// backend/testAuth.js
const axios = require('axios');

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Full response:', JSON.stringify(response.data, null, 2));
    
    // Extract tokens
    const { accessToken, refreshToken } = response.data;
    
    if (accessToken && refreshToken) {
      console.log('Access token:', accessToken);
      console.log('Refresh token:', refreshToken);
      
      // Test accessing a protected endpoint
      const protectedResponse = await axios.get('http://localhost:5000/api/movies', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      console.log('Protected endpoint access successful!');
      console.log('Movies count:', protectedResponse.data.length);
    } else {
      console.log('Tokens not found in response');
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testLogin();