const getAllJSONFiles = require('./loadData');

// Функция для поиска товаров по названию
function searchProducts(searchTerm) {
    // Получаем все файлы JSON из подпапок
    const jsonFiles = getAllJSONFiles();

    // Массив для хранения всех товаров из всех файлов
    let allProducts = [];

    // Последовательная загрузка данных из всех файлов
    Promise.all(jsonFiles.map(filePath =>
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load JSON (${response.status} ${response.statusText})`);
                }
                return response.json();
            })
            .then(data => {
                // Добавление товаров из текущего файла в общий массив
                allProducts = allProducts.concat(data.products);
            })
            .catch(error => console.error('Ошибка при загрузке данных из файла', filePath, ':', error))
    )).then(() => {
        // Фильтруем товары по заданному поисковому запросу
        const filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Отображаем отфильтрованные товары
        displayProducts(filteredProducts);
    });
}

// Экспортируем функцию поиска
module.exports = searchProducts;
