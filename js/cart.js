document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Функция для отображения количества товаров и их общей стоимости в корзине
    function updateCartInfo() {
        const cartItemCount = cart.reduce((total, product) => total + product.quantity, 0);
        const cartTotalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);

        const cartInfoElement = document.getElementById('cart-info');
        cartInfoElement.textContent = `В корзине ${cartItemCount} товаров на сумму $${cartTotalPrice.toFixed(2)}`;
    }

    // Обновляем информацию о корзине при загрузке страницы
    updateCartInfo();

    // Проверяем, есть ли товары в корзине
    if (cart.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Корзина пуста';
        cartItemsContainer.appendChild(emptyCartMessage);
    } else {
        cart.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Цена: $${product.price.toFixed(2)}</p>
                <p>Количество: <span class="quantity">${product.quantity}</span></p>
                <button class="btn-decrease">-</button>
                <button class="btn-increase">+</button>
                <button class="btn-remove">Удалить</button> <!-- Добавили кнопку удаления -->
            `;
            cartItemsContainer.appendChild(productElement);

            const quantityElement = productElement.querySelector('.quantity');
            const increaseButton = productElement.querySelector('.btn-increase');
            const decreaseButton = productElement.querySelector('.btn-decrease');
            const removeButton = productElement.querySelector('.btn-remove');

            // Обработчик события для увеличения количества товара
            increaseButton.addEventListener('click', function() {
                product.quantity++;
                quantityElement.textContent = product.quantity;
                saveCartToLocalStorage(cart); // Сохраняем обновленную корзину в localStorage
                updateCartInfo(); // Обновляем информацию о корзине
            });

            // Обработчик события для уменьшения количества товара
            decreaseButton.addEventListener('click', function() {
                if (product.quantity > 1) {
                    product.quantity--;
                    quantityElement.textContent = product.quantity;
                    saveCartToLocalStorage(cart); // Сохраняем обновленную корзину в localStorage
                    updateCartInfo(); // Обновляем информацию о корзине
                }
            });

            // Обработчик события для удаления товара
            removeButton.addEventListener('click', function() {
                const index = cart.indexOf(product);
                if (index !== -1) {
                    cart.splice(index, 1); // Удаляем товар из корзины
                    productElement.remove(); // Удаляем элемент товара из DOM
                    saveCartToLocalStorage(cart); // Сохраняем обновленную корзину в localStorage
                    updateCartInfo(); // Обновляем информацию о корзине
                }
            });
        });

        // Создаем кнопку для очистки корзины
        const clearCartButton = document.createElement('button');
        clearCartButton.textContent = 'Очистить корзину';
        clearCartButton.addEventListener('click', function() {
            localStorage.removeItem('cart');
            cartItemsContainer.innerHTML = '';
            const emptyCartMessage = document.createElement('p');
            emptyCartMessage.textContent = 'Корзина очищена';
            cartItemsContainer.appendChild(emptyCartMessage);
            updateCartInfo(); // Обновляем информацию о корзине
        });
        cartItemsContainer.appendChild(clearCartButton);
    }
});

// Функция для сохранения обновленной корзины в localStorage
function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
