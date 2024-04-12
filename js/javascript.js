document.addEventListener('DOMContentLoaded', function () {
    // Получаем ссылки на категории и подкатегории
    const categoriesLinks = document.querySelectorAll('#catalog .top-level > li > a');
    const subcategoriesLinks = document.querySelectorAll('#catalog .sub-level a');

    // Получаем контейнер, в котором будем отображать товары
    const productContainer = document.querySelector('.product');

    // Функция для загрузки и отображения товаров
    function loadProducts(category, subcategory) {
        console.log('Category:', category);
        console.log('Subcategory:', subcategory);

        const basePath = 'data'; // Базовый путь к папке с JSON файлами

        fetch(`${basePath}/${category}/${subcategory}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load JSON (${response.status} ${response.statusText})`);
                }
                return response.json();
            })
            .then(data => {
                // Очищаем контейнер с товарами
                productContainer.innerHTML = '';

                // Отображаем товары
                data.products.forEach(product => {
                    // Создаем элемент для товара
                    const productElement = document.createElement('div');
                    productElement.classList.add('product-item');

                    // Добавляем информацию о товаре
                    productElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Цена: $${product.price.toFixed(2)}</p>
                    `;

                    // Создаем кнопку "Добавить в корзину"
                    const addToCartButton = document.createElement('button');
                    addToCartButton.textContent = 'Добавить в корзину';
                    addToCartButton.addEventListener('click', function(event) {
                        event.preventDefault();
                        addToCart(product);
                    });

                    // Добавляем кнопку к элементу товара
                    productElement.appendChild(addToCartButton);

                    // Добавляем товар на страницу
                    productContainer.appendChild(productElement);
                });
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }

    // Обработчик события клика на ссылку категории
    categoriesLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Отменяем переход по ссылке
            const clickedCategory = event.target.getAttribute('data-category');
            loadProducts(clickedCategory, ''); // Загружаем товары для данной категории
        });
    });

    // Обработчик события клика на ссылку подкатегории
    subcategoriesLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Отменяем переход по ссылке
            const category = link.getAttribute('data-parent-category');
            const subcategory = link.getAttribute('data-subcategory');
            loadProducts(category, subcategory); // Загружаем товары для данной подкатегории
        });
    });

    // Добавленная функция для добавления товара в корзину
    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex !== -1) {
            // Если товар уже есть в корзине, увеличиваем его количество на 1
            cart[existingProductIndex].quantity += 1;
        } else {
            // Если товара с таким id нет в корзине, добавляем его с количеством 1
            product.quantity = 1;
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину!');
    }
});
