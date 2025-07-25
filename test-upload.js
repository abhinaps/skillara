const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('🔄 Testing file upload...');
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('./test-resume.txt'), {
      filename: 'test-resume.txt',
      contentType: 'text/plain'
    });
    
    // Make request
    const response = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        'X-Session-Id': 'test-session',
        ...form.getHeaders()
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload successful!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Upload failed!');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpload();
