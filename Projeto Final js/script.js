document.addEventListener('DOMContentLoaded', function() {
    // Seletores do DOM
    const productList = document.getElementById('productList');
    const catalogList = document.getElementById('catalogList');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const productDescriptionInput = document.getElementById('productDescription');
    const productPriceInput = document.getElementById('productPrice');
    const productAvailabilityInput = document.getElementById('productAvailability');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const showRegisterButton = document.getElementById('showRegister');
    const showLoginButton = document.getElementById('showLogin');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const catalogSection = document.getElementById('catalogSection');
    const productsSection = document.getElementById('productsSection');
    const productDetailsSection = document.getElementById('productDetailsSection');
    const productDetails = document.getElementById('productDetails');
    const backToCatalogButton = document.getElementById('backToCatalog');

    let cart = [];
    let total = 0;
    let users = {}; // Armazena usuários com formato { username: password }
    let currentUser = null;
    let products = []; // Armazena produtos cadastrados

    // Função para adicionar produto ao carrinho
    function addToCart(name, price) {
        if (!currentUser) {
            alert('Você precisa estar logado para adicionar itens ao carrinho.');
            return;
        }
        cart.push({ name, price });
        updateCart();
    }

    // Função para atualizar o carrinho
    function updateCart() {
        cartItems.innerHTML = '';
        total = cart.reduce((sum, item) => sum + item.price, 0);
        cart.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - R$${item.price.toFixed(2)}`;
            cartItems.appendChild(li);
        });
        cartTotal.textContent = `R$${total.toFixed(2)}`;
    }

    // Função para criar um botão de adicionar ao carrinho
    function createAddButton(name, price) {
        const button = document.createElement('button');
        button.textContent = 'Adicionar ao carrinho';
        button.onclick = () => addToCart(name, price);
        return button;
    }

    // Função para adicionar um produto à lista
    function addProductToList(name, description, price, availability) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        const h3 = document.createElement('h3');
        h3.textContent = name;
        const pDescription = document.createElement('p');
        pDescription.textContent = `Descrição: ${description}`;
        const pPrice = document.createElement('p');
        pPrice.textContent = `Preço: R$${price.toFixed(2)}`;
        const pAvailability = document.createElement('p');
        pAvailability.textContent = `Disponibilidade: ${availability}`;
        const addButton = createAddButton(name, price);
        productDiv.appendChild(h3);
        productDiv.appendChild(pDescription);
        productDiv.appendChild(pPrice);
        productDiv.appendChild(pAvailability);
        productDiv.appendChild(addButton);
        productList.appendChild(productDiv);
    }

    // Função para adicionar um produto ao catálogo
    function addProductToCatalog(name, description, price, availability) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        const h3 = document.createElement('h3');
        h3.textContent = name;
        const pDescription = document.createElement('p');
        pDescription.textContent = `Descrição: ${description}`;
        const pPrice = document.createElement('p');
        pPrice.textContent = `Preço: R$${price.toFixed(2)}`;
        const pAvailability = document.createElement('p');
        pAvailability.textContent = `Disponibilidade: ${availability}`;
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.textContent = 'Ver Detalhes';
        viewDetailsButton.onclick = () => viewProductDetails(name);
        productDiv.appendChild(h3);
        productDiv.appendChild(pDescription);
        productDiv.appendChild(pPrice);
        productDiv.appendChild(pAvailability);
        productDiv.appendChild(viewDetailsButton);
        catalogList.appendChild(productDiv);
    }

    // Função para adicionar um produto
    function addProduct(name, description, price, availability) {
        products.push({ name, description, price, availability });
        addProductToList(name, description, price, availability);
        addProductToCatalog(name, description, price, availability);
    }

    // Função para buscar e exibir detalhes de um produto da API
    function viewProductDetails(name) {
        fetch(`https://fakestoreapi.com/products`)
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.title === name);
                if (product) {
                    productDetails.innerHTML = `
                        <h3>${product.title}</h3>
                        <p>Descrição: ${product.description}</p>
                        <p>Preço: R$${product.price.toFixed(2)}</p>
                        <p>Categoria: ${product.category}</p>
                        <p>Disponibilidade: ${product.stock ? 'Em estoque' : 'Fora de estoque'}</p>
                        <img src="${product.image}" alt="${product.title}" style="width: 100px;">
                    `;
                    productDetailsSection.style.display = 'block';
                    catalogSection.style.display = 'none';
                    productsSection.style.display = 'none';
                } else {
                    alert('Produto não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do produto:', error);
                alert('Não foi possível carregar os detalhes do produto.');
            });
    }

    // Voltar ao catálogo
    backToCatalogButton.addEventListener('click', function() {
        productDetailsSection.style.display = 'none';
        catalogSection.style.display = 'block';
    });

    // Adiciona um produto ao clicar no formulário
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = productNameInput.value.trim();
        const description = productDescriptionInput.value.trim();
        const price = parseFloat(productPriceInput.value.trim());
        const availability = productAvailabilityInput.value;
        if (name && description && !isNaN(price) && price > 0) {
            addProduct(name, description, price, availability);
            productNameInput.value = '';
            productDescriptionInput.value = '';
            productPriceInput.value = '';
            productAvailabilityInput.value = 'Em estoque';
        }
    });

    // Adiciona alguns produtos iniciais
    addProduct('Produto 1', 'Descrição do Produto 1', 10.00, 'Em estoque');
    addProduct('Produto 2', 'Descrição do Produto 2', 20.00, 'Fora de estoque');

    // Função para registrar um novo usuário
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = registerUsernameInput.value.trim();
        const password = registerPasswordInput.value.trim();
        if (username && password) {
            if (users[username]) {
                alert('Usuário já existe!');
            } else {
                users[username] = password;
                alert('Usuário registrado com sucesso!');
                registerUsernameInput.value = '';
                registerPasswordInput.value = '';
                showLogin();
            }
        }
    });

    // Função para fazer login
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();
        if (users[username] === password) {
            currentUser = username;
            alert(`Bem-vindo, ${username}!`);
            showCatalog();
        } else {
            alert('Usuário ou senha inválidos!');
        }
    });

    // Função para exibir a seção de registro
    function showRegister() {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        catalogSection.style.display = 'none';
        productsSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
    }

    // Função para exibir a seção de login
    function showLogin() {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        catalogSection.style.display = 'none';
        productsSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
    }

    // Função para exibir a seção do catálogo
    function showCatalog() {
        loginSection.style.display = 'none';
        registerSection.style.display = 'none';
        catalogSection.style.display = 'block';
        productsSection.style.display = 'none';
        productDetailsSection.style.display = 'none';
    }

    // Função para exibir a seção de produtos
    function showProducts() {
        loginSection.style.display = 'none';
        registerSection.style.display = 'none';
        catalogSection.style.display = 'none';
        productsSection.style.display = 'block';
        productDetailsSection.style.display = 'none';
    }

    // Adiciona eventos para alternar entre login e registro
    showRegisterButton.addEventListener('click', showRegister);
    showLoginButton.addEventListener('click', showLogin);

    // Inicialmente, exibe a seção de login
    showLogin();
});