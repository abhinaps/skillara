const fs = require('fs');
const path = require('path');

// Test text extraction from the stored PDF
async function testTextExtraction() {
  try {
    console.log('🔄 Testing text extraction from stored PDF...');

    // Path to the stored PDF (from the database check)
    const storedPdfPath = path.join(__dirname, 'uploads', 'documents', '9449b63f-345c-4a7d-bfb1-5ef41d90d2c9.pdf');

    // Check if file exists
    if (!fs.existsSync(storedPdfPath)) {
      console.log('❌ Stored PDF file not found at:', storedPdfPath);
      return;
    }

    console.log('✅ Found stored PDF file');
    console.log('📊 File size:', fs.statSync(storedPdfPath).size, 'bytes');

    // Try to read the PDF and extract text using pdf-parse
    const pdf = require('pdf-parse');
    const pdfBuffer = fs.readFileSync(storedPdfPath);

    console.log('🔄 Extracting text from PDF...');
    const pdfData = await pdf(pdfBuffer);

    console.log('✅ Text extraction completed!');
    console.log('📄 Pages:', pdfData.numpages);
    console.log('📝 Text length:', pdfData.text.length, 'characters');
    console.log('🔤 First 200 characters:');
    console.log(pdfData.text.substring(0, 200) + '...');

    // Test structured extraction
    console.log('\n🔄 Testing structured text analysis...');

    // Look for common resume sections
    const text = pdfData.text.toLowerCase();
    const sections = {
      'Contact Info': /email|phone|address|linkedin/gi.test(pdfData.text),
      'Experience': /experience|work|employment|position|job/gi.test(pdfData.text),
      'Education': /education|degree|university|college|school/gi.test(pdfData.text),
      'Skills': /skills|technologies|programming|languages/gi.test(pdfData.text)
    };

    console.log('📋 Detected sections:');
    Object.entries(sections).forEach(([section, found]) => {
      console.log(`  ${found ? '✅' : '❌'} ${section}`);
    });

    // Enhanced skill detection
    console.log('\n🔍 Detecting technical skills...');

    const skillPatterns = {
      'Programming Languages': [
        'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'php', 'ruby', 'go', 'rust',
        'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash', 'powershell'
      ],
      'Frontend Technologies': [
        'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
        'jquery', 'webpack', 'vite', 'next.js', 'nuxt', 'gatsby', 'svelte'
      ],
      'Backend Technologies': [
        'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'rails',
        'fastapi', 'nest.js', 'koa', 'hapi', 'gin', 'echo'
      ],
      'Databases': [
        'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
        'cassandra', 'elasticsearch', 'dynamodb', 'firestore', 'couchdb'
      ],
      'Cloud & DevOps': [
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions',
        'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache'
      ],
      'Tools & Others': [
        'git', 'svn', 'jira', 'confluence', 'slack', 'teams', 'figma', 'sketch',
        'photoshop', 'illustrator', 'postman', 'insomnia', 'vs code', 'intellij'
      ]
    };

    const detectedSkills = {};
    const allText = pdfData.text.toLowerCase();

    Object.entries(skillPatterns).forEach(([category, skills]) => {
      const foundSkills = skills.filter(skill => {
        const variations = [
          skill,
          skill.replace('.', ''),
          skill.replace('-', ''),
          skill.replace('_', ''),
          skill.replace(' ', '')
        ];
        return variations.some(variation => allText.includes(variation.toLowerCase()));
      });

      if (foundSkills.length > 0) {
        detectedSkills[category] = foundSkills;
      }
    });

    // Display detected skills
    if (Object.keys(detectedSkills).length > 0) {
      console.log('🎯 Detected Skills:');
      Object.entries(detectedSkills).forEach(([category, skills]) => {
        console.log(`\n  📂 ${category}:`);
        skills.forEach(skill => {
          console.log(`    ✅ ${skill}`);
        });
      });
    } else {
      console.log('❌ No technical skills detected (this might be a non-technical document)');
    }

    // Look for specific keywords and phrases
    console.log('\n🔍 Document content analysis...');
    const keywordAnalysis = {
      'Form/Document Type': [],
      'Organizations': [],
      'Numbers/IDs': [],
      'Dates': []
    };

    // Form types
    const formTypes = ['form 16', 'form 26as', 'certificate', 'receipt', 'invoice', 'statement'];
    formTypes.forEach(type => {
      if (allText.includes(type)) {
        keywordAnalysis['Form/Document Type'].push(type.toUpperCase());
      }
    });

    // Extract some key phrases (first 10 words that appear multiple times)
    const words = allText.split(/\s+/).filter(word => word.length > 3);
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const frequentWords = Object.entries(wordCount)
      .filter(([word, count]) => count > 2 && !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'been', 'will'].includes(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (frequentWords.length > 0) {
      console.log('\n📊 Most frequent terms:');
      frequentWords.forEach(([word, count]) => {
        console.log(`  📈 "${word}" (${count} times)`);
      });
    }

    // Display document analysis
    Object.entries(keywordAnalysis).forEach(([category, items]) => {
      if (items.length > 0) {
        console.log(`\n  📋 ${category}:`);
        items.forEach(item => console.log(`    🔸 ${item}`));
      }
    });

    console.log('\n🎉 Text extraction test completed successfully!');

  } catch (error) {
    console.error('❌ Error during text extraction:', error);
  }
}

testTextExtraction().catch(console.error);
