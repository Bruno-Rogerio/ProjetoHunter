document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const templateMessage = "🔥 Oferta imperdível: {nome} por apenas R$ {preco}! Confira: {link}";

    // Carregar produtos do LocalStorage
    loadProducts();

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            id: Date.now(), // Usar timestamp como ID único
            nome: document.getElementById('nome').value,
            preco: parseFloat(document.getElementById('preco').value),
            linkAfiliado: document.getElementById('linkAfiliado').value
        };

        addProduct(product);
        productForm.reset();
    });

    function addProduct(product) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }

    function loadProducts() {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        productList.innerHTML = products.map(product => {
            const message = templateMessage
                .replace('{nome}', product.nome)
                .replace('{preco}', product.preco.toFixed(2))
                .replace('{link}', product.linkAfiliado);

            return `
                <div class="product-item">
                    <h3>${product.nome}</h3>
                    <p>Preço: R$ ${product.preco.toFixed(2)}</p>
                    <p>Link: <a href="${product.linkAfiliado}" target="_blank">Afiliado</a></p>
                    <p>Mensagem: ${message}</p>
                    <button onclick="deleteProduct(${product.id})">Deletar</button>
                </div>
            `;
        }).join('');
    }

    window.deleteProduct = (id) => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(product => product.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    };
});
