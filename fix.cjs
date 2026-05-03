const fs = require('fs');
const path = require('path');

const dir = './src/games/';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.endsWith('.jsx')) {
    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    // Replace \` with `
    content = content.replace(/\\`/g, '`');
    // Replace \$ with $
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', fullPath);
  }
});
