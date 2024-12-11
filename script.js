document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const formSection = document.getElementById('formSection');
    const marketplaceSection = document.getElementById('marketplaceSection');
    const searchBar = document.getElementById('searchBar');
    const sortFilter = document.getElementById('sortFilter');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const feedbackMessage = document.getElementById('feedbackMessage'); // Mensagem de feedback
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
        const nome = document.getElementById('nome').value.trim();
        const precoAntigo = parseFloat(document.getElementById('precoAntigo').value);
        const preco = parseFloat(document.getElementById('preco').value);
        const linkAfiliado = document.getElementById('linkAfiliado').value.trim();
        const categoria = document.getElementById('categoria').value.trim();

        // Validações simples
        if (!nome || !linkAfiliado || !categoria || isNaN(precoAntigo) || isNaN(preco) || precoAntigo <= 0 || preco <= 0 || preco >= precoAntigo) {
            alert('Por favor, preencha todos os campos corretamente. O preço atual deve ser menor que o preço antigo.');
            return;
        }

        const product = {
            nome,
            precoAntigo,
            preco,
            link_afiliado: linkAfiliado,
            categoria,
            template: "🔥 OFERTA IMPERDÍVEL!\n\n{nome}\n\n💰 De: R$ {precoAntigo}\n\n💥 Por apenas: R$ {preco}\n\nEconomize R$ {economia}!\n\n🛒 Compre agora pelo link abaixo:\n\n{link_afiliado}"
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

    async function loadProducts() {
    feedbackMessage.textContent = 'Carregando produtos...';
    feedbackMessage.style.display = 'block';
    try {
        const response = await fetch(`${serverUrl}/produtos`);
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos: ' + response.statusText);
        }
        products = await response.json(); // Atualiza o array local
        renderProducts(products);  // Garanta que isso seja chamado após carregar os produtos
        feedbackMessage.style.display = 'none';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
        feedbackMessage.style.display = 'none';
    }
}
    // Exibir a lista de produtos organizados por categoria
    function renderProducts(filteredProducts) {
        if (filteredProducts.length === 0) {
            categoriesContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        const categories = [...new Set(filteredProducts.map(product => product.categoria))];
        categoriesContainer.innerHTML = categories.map(category => {
            const categoryProducts = filteredProducts.filter(product => product.categoria === category);
            return `
                <div class="category">
                    <h2>${category}</h2>
                    <div class="products">
                        ${categoryProducts.map(product => {
                            const precoAntigo = product.precoAntigo.toFixed(2);
                            const precoAtual = product.preco.toFixed(2);
                            const economia = (product.precoAntigo - product.preco).toFixed(2);

                            return `
                                <div class="product-item">
                                    <h3><strong>🔥 OFERTA IMPERDÍVEL!</strong></h3>
                                    <p><strong>${product.nome}</strong></p>
                                    <p>💰 De: <span class="price-old">R$ ${precoAntigo}</span></p>
                                    <p>💥 Por apenas: <span class="price-new">R$ ${precoAtual}</span></p>
                                    <p><strong>Economize R$ ${economia}!</strong></p>
                                    <p>🛒 Compre agora pelo link abaixo:</p>
                                    <p>Link: <a href="${product.link_afiliado}" target="_blank">${product.link_afiliado}</a></p>
                                </div>
                            `;
                        }).join('')}
                    </div>
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
