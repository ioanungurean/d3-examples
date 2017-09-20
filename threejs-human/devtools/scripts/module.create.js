const fs = require('fs');
const rootDir = './src/modules/_dummy';
const jsDir = rootDir.concat('/js');
const scssDir = rootDir.concat('/scss');
const templateDir = rootDir.concat('/template');

if (!fs.existsSync(rootDir)) {
  fs.mkdirSync(rootDir);
  fs.mkdirSync(jsDir);
  fs.mkdirSync(scssDir);
  fs.mkdirSync(templateDir);
}
