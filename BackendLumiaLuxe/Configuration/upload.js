const fs = require('fs');
const path = require('path');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/products',
    'uploads/profile'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

module.exports = createUploadDirs;