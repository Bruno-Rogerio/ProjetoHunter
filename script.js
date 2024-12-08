document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const formSection = document.getElementById('formSection');
    const marketplaceSection = document.getElementById('marketplaceSection');
    const searchBar = document.getElementById('searchBar');
    const sortFilter = document.getElementById('sortFilter');
    const serverUrl = 'https://projetohunterback.onrender.com';

    let products = []; // Array local para armazenar os produtos

    // Alternar entre as seções do menu
    document.getElementById('showForm').addEventListener('click', () => {
        formSection.style.display = 'block';
        marketplaceSection.style.display = 'none';
    });

    document.getElementById('showMarketplace').addEventListener('click', () => {
        formSection.style.display = 'none';
        marketplaceSection.style.display = 'block';
        loadProducts(); // Atualizar a lista de produtos ao acessar o marketplace
    });

    // Adicionar Produto
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const product = {
            nome: document.getElementById('nome').value,
            precoAntigo: parseFloat(document.getElementById('precoAntigo').value),
            preco: parseFloat(document.getElementById('preco').value),
            link_afiliado: document.getElementById('linkAfiliado').value,
        };

        try {
            const response = await fetch(`${serverUrl}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                alert('Produto adicionado com sucesso!');
                productForm.reset();
                loadProducts(); // Atualiza a lista de produtos
            } else {
                const responseData = await response.json();
                console.error('Erro ao adicionar produto:', responseData);
                alert(`Erro ao adicionar produto: ${responseData.erro || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao comunicar com o servidor: ' + error.message);
        }
    });

    // Carregar Produtos
    async function loadProducts() {
        try {
            const response = await fetch(`${serverUrl}/produtos`);
            products = await response.json(); // Atualiza o array local
            renderProducts(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
        }
    }

    // Exibir a lista de produtos (com os campos certos e layout modelado)
    function renderProducts(filteredProducts) {
        productList.innerHTML = filteredProducts.map(product => {
            // Calcula a economia
            const precoAntigo = product.precoAntigo.toFixed(2);
            const precoAtual = product.preco.toFixed(2);
            const economia = (product.precoAntigo - product.preco).toFixed(2);

            // Template ajustado ao formato exigido
            return `
                <div class="product-item">
                    <h3><strong>🔥 OFERTA IMPERDÍVEL!</strong></h3>
                    <p><strong>${product.nome}</strong></p>
                    <p>💰 De: <span class="price-old">R$ ${precoAntigo}</span></p>
                    <p>💥 Por apenas: <span class="price-new">R$ ${precoAtual}</span></p>
                    <p><strong>Economize R$ ${economia}!</strong></p>
                    <p>🛒 Compre agora pelo link abaixo:</p>
                    <p>${product.link_afiliado}</p>
                </div>
            `;
        }).join('');
    }

    // Filtros e busca
    searchBar.addEventListener('input', () => {
        const searchQuery = searchBar.value.toLowerCase();
        const filtered = products.filter(product => 
            product.nome.toLowerCase().includes(searchQuery)
        );
        renderProducts(filtered);
    });

    sortFilter.addEventListener('change', () => {
        const sortOption = sortFilter.value;
        let sortedProducts = [...products];

        if (sortOption === 'menorPreco') {
            sortedProducts.sort((a, b) => a.preco - b.preco);
        } else if (sortOption === 'maiorPreco') {
            sortedProducts.sort((a, b) => b.preco - a.preco);
        } else if (sortOption === 'maisRecente') {
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        renderProducts(sortedProducts);
    });
});
