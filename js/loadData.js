const fs = require('fs');
const path = require('path');

// Функция для рекурсивного обхода папок и загрузки файлов JSON
function loadJSONFiles(dirPath, filesArr) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            // Если это директория, рекурсивно вызываем функцию для этой директории
            loadJSONFiles(filePath, filesArr);
        } else if (path.extname(file) === '.json') {
            // Если это файл JSON, добавляем его путь в массив файлов
            filesArr.push(filePath);
        }
    });
}

// Функция для загрузки всех файлов JSON из папки 'data'
function getAllJSONFiles() {
    const jsonFiles = [];
    const dataDir = path.join(__dirname, 'data');
    loadJSONFiles(dataDir, jsonFiles);
    return jsonFiles;
}

module.exports = getAllJSONFiles;
