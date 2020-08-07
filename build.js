const fs = require("fs");
const path = require("path");

const { statSync, readdirSync, writeFileSync } = fs;

const { resolve, basename, extname } = path;

const ROOT_PATH = resolve("./");
const OUT_PATH = resolve("./");
const LOOP_DIRS = ["HTML", "JS", "MongoDB", "Nginx", "Other"];
const FILTER_DIRS = ["imgs", "img"];
const DEFAULT_TEXT = `# blog \n个人技术博客, 不定时更新, 哈哈哈哈~ \n`;

const isDir = (path) => statSync(path).isDirectory();
const isMdFile = (file) => extname(file) === ".md";

const getDirectoryList = (pathname, level) => {
  return readdirSync(pathname).reduce((list, file) => {
    const filePath = resolve(pathname, file);
    let title, children, type;
    if (
      isDir(filePath) &&
      (LOOP_DIRS.includes(file) || level > 0) &&
      !FILTER_DIRS.includes(file)
    ) {
      title = file;
      children = getDirectoryList(filePath, level + 1);
      type = "dir";
    } else if (isMdFile(file) && level > 0) {
      title = `[${basename(file, extname(file))}](.${filePath.replace(
        ROOT_PATH,
        ""
      )})`;
      type = "file";
    }
    if (title) {
      list.push({
        title,
        children,
        type,
        level,
      });
    }
    return list;
  }, []);
};

const directoryList = getDirectoryList(ROOT_PATH, 0);

const getText = (list, defaultText = "") => {
  return list.reduce((content, file) => {
    const { title, children, type, level } = file;
    if (type === "dir") {
      if (!level) {
        content += `\n\n## ${title}`;
      } else {
        content += `\n${new Array(level - 1).fill("\t").join("")}- ${title}`;
      }
      if (Array.isArray(children) && !!children.length) {
        content += getText(children);
      }
    } else {
      content += `\n${new Array(level - 1).fill("\t").join("")}- ${title}`;
    }
    return content;
  }, defaultText);
};

writeFileSync(
  resolve(OUT_PATH, "README.md"),
  getText(directoryList, DEFAULT_TEXT)
);
