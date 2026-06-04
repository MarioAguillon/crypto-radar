const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'src', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

// 1. Collect all files to rename
const filesToRename = [];
walkDir(rootDir, (filePath) => {
  if (filePath.includes('.component.')) {
    const newPath = filePath.replace('.component.', '.');
    filesToRename.push({ old: filePath, new: newPath });
  }
});

// 2. Perform the rename
filesToRename.forEach(({ old, new: newPath }) => {
  fs.renameSync(old, newPath);
  console.log(`Renamed: ${path.basename(old)} -> ${path.basename(newPath)}`);
});

// 3. Collect all .ts files to update contents
const tsFiles = [];
walkDir(rootDir, (filePath) => {
  if (filePath.endsWith('.ts')) {
    tsFiles.push(filePath);
  }
});

// Also include app.routes.ts and app.ts if they are outside src/app but they are inside src/app
tsFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace import paths: './home.component' -> './home'
  // Also templateUrl: './home.component.html' -> './home.html'
  // styleUrl: './home.component.scss' -> './home.scss'
  
  // This regex replaces .component when it's part of a string path
  content = content.replace(/\.component(['"])/g, '$1');
  content = content.replace(/\.component\.html/g, '.html');
  content = content.replace(/\.component\.scss/g, '.scss');
  content = content.replace(/\.component\.css/g, '.css');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in: ${path.basename(filePath)}`);
  }
});

console.log('Renaming and updating complete.');
