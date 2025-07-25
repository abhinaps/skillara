const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPdfUpload() {
  try {
    console.log('🔄 Testing PDF file upload with From16_A.pdf...');

    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('./From16_A.pdf'), {
      filename: 'From16_A.pdf',
      contentType: 'application/pdf'
    });

    // Make request
    const response = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        'X-Session-Id': 'pdf-test-session',
        ...form.getHeaders()
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ PDF Upload successful!');
      console.log('Response:', JSON.stringify(result, null, 2));

      if (result.document && result.document.id) {
        console.log('📄 Document uploaded with ID:', result.document.id);
        console.log('📊 File size:', result.document.size, 'bytes');
        console.log('📋 MIME type:', result.document.mimeType);
        console.log('✅ Status:', result.document.status);

        // Test retrieving the document
        await testGetDocument(result.document.id);
      }
    } else {
      console.log('❌ PDF Upload failed!');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testGetDocument(documentId) {
  try {
    console.log(`\n🔄 Testing document retrieval for ID: ${documentId}...`);

    const response = await fetch(`http://localhost:4000/api/documents/${documentId}`, {
      headers: {
        'X-Session-Id': 'pdf-test-session'
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Document retrieval successful!');
      console.log('Document details:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ Document retrieval failed!');
      console.log('Response:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Document retrieval error:', error.message);
  }
}

// Test database connection first
async function testDatabase() {
  try {
    console.log('🔄 Testing database connection...');
    const response = await fetch('http://localhost:4000/health');
    const result = await response.json();

    if (response.ok) {
      console.log('✅ Backend is healthy!');
      console.log('Health check:', result);
      return true;
    } else {
      console.log('❌ Backend health check failed!');
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting PDF Upload Test Suite...\n');

  const isHealthy = await testDatabase();
  if (!isHealthy) {
    console.log('❌ Backend is not healthy. Exiting...');
    return;
  }

  console.log('\n' + '='.repeat(50));
  await testPdfUpload();
  console.log('='.repeat(50));

  console.log('\n✅ PDF Upload Test Suite completed!');
}

main();
