const fs = require('fs');
const rootDir = './src/webcomponents/_dummy';
const i18nDir = rootDir.concat('/i18n');
const jsDir = rootDir.concat('/js');
const scssDir = rootDir.concat('/scss');
const imagesDir = rootDir.concat('/images');
const templateDir = rootDir.concat('/template');

if (!fs.existsSync(rootDir)) {
  fs.mkdirSync(rootDir);
  fs.mkdirSync(i18nDir);
  fs.mkdirSync(jsDir);
  fs.mkdirSync(scssDir);
  fs.mkdirSync(imagesDir);
  fs.mkdirSync(templateDir);
}
