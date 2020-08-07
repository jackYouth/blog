const fs = require("fs");
const path = require("path");

const { statSync, readdirSync, writeFileSync } = fs;

const { resolve, basename, extname } = path;

const ROOT_PATH = resolve("./");
const OUT_PATH = resolve("./");
const LOOP_DIRS = ["HTML", "JS", "MongoDB", "Nginx", "Other"];

const isDir = (path) => statSync(path).isDirectory();
const isMdFile = (file) => extname(file) === ".md";

let text = `# blog \n个人技术博客, 不定时更新, 哈哈哈哈~ \n`;

const creator = (pathname, level) => {
  const files = readdirSync(pathname);
  files.forEach((file) => {
    const filePath = resolve(pathname, file);
    if (isDir(filePath) && LOOP_DIRS.includes(file)) {
      text += `\n\n### ${file}`;
      creator(filePath, level + 1);
    } else if (isMdFile(file) && level > 0) {
      text += `\n- [${basename(file, extname(file))}](.${filePath.replace(
        ROOT_PATH,
        ""
      )})`;
    }
  });
};

creator(ROOT_PATH, 0);

writeFileSync(resolve(OUT_PATH, "test.md"), text);
