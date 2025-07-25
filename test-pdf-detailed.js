const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

async function testPdfUploadWithBetterErrorHandling() {
  try {
    console.log('🔄 Testing PDF file upload with detailed error handling...');

    // Use the pre-created test session ID
    const sessionId = '9cd6b6d2-8a3e-4487-8ccd-1265340f33dc';
    console.log('🆔 Using session ID:', sessionId);

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('./From16_A.pdf'), {
      filename: 'From16_A.pdf',
      contentType: 'application/pdf'
    });

    console.log('📤 Sending request to /api/upload...');

    // Make request with timeout
    const response = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        'X-Session-Id': sessionId,
        ...form.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('📡 Response received:');
    console.log('  Status:', response.status);
    console.log('  Status Text:', response.statusText);
    console.log('  Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first
    const responseText = await response.text();
    console.log('📝 Raw response text:');
    console.log('  Length:', responseText.length);
    console.log('  Content:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));

    // Try to parse as JSON
    if (responseText.trim()) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ JSON parsed successfully:', result);
      } catch (jsonError) {
        console.log('❌ JSON parsing failed:', jsonError.message);
        console.log('📄 Response is not valid JSON');
      }
    } else {
      console.log('⚠️ Response is empty');
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
  }
}

testPdfUploadWithBetterErrorHandling();
