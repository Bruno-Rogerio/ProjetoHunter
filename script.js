document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const formSection = document.getElementById('formSection');
    const marketplaceSection = document.getElementById('marketplaceSection');
    const searchBar = document.getElementById('searchBar');
    const sortFilter = document.getElementById('sortFilter');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const productList = document.getElementById('productList'); // Certifique-se de que exista no HTML.
    const serverUrl = 'https://projetohunterback.onrender.com';

    let products = []; // Armazena os produtos carregados.

    // Alternar entre seções
    document.getElementById('showForm').addEventListener('click', () => {
        formSection.style.display = 'block';
        marketplaceSection.style.display = 'none';
    });

    document.getElementById('showMarketplace').addEventListener('click', () => {
        formSection.style.display = 'none';
        marketplaceSection.style.display = 'block';
        loadProducts(); // Atualiza os produtos ao acessar o marketplace.
    });

    // Adicionar Produto
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const precoAntigo = parseFloat(document.getElementById('precoAntigo').value);
        const preco = parseFloat(document.getElementById('preco').value);
        const linkAfiliado = document.getElementById('linkAfiliado').value.trim();
        const categoria = document.getElementById('categoria').value.trim();

        if (!nome || !linkAfiliado || !categoria || isNaN(precoAntigo) || isNaN(preco) || precoAntigo <= preco) {
            alert('Preencha os campos corretamente.');
            return;
        }

        const product = {
            nome,
            precoAntigo,
            preco,
            link_afiliado: linkAfiliado,
            categoria,
            template: "🔥 OFERTA IMPERDÍVEL!\n\n{nome}\n\n💰 De: R$ {precoAntigo}\n💥 Por apenas: R$ {preco}\n\nEconomize R$ {economia}!\n\n🛒 Link: {link_afiliado}"
        };

        try {
            const response = await fetch(`${serverUrl}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });

            const responseData = await response.json();
            if (response.ok) {
                alert('Produto cadastrado!');
                productForm.reset();
                loadProducts();
            } else {
                alert(`Erro: ${responseData.erro}`);
            }
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
        }
    });

    // Carregar Produtos
    async function loadProducts() {
        try {
            feedbackMessage.textContent = 'Carregando produtos...';
            feedbackMessage.style.display = 'block';

            const response = await fetch(`${serverUrl}/produtos`);
            if (!response.ok) throw new Error('Erro ao carregar produtos');

            products = await response.json();
            renderProducts(products);

            feedbackMessage.style.display = 'none';
        } catch (error) {
            console.error('Erro:', error);
            feedbackMessage.textContent = 'Erro ao carregar produtos.';
        }
    }

    // Renderizar Produtos
    function renderProducts(filteredProducts) {
        const html = filteredProducts.map(product => {
            const precoAntigo = product.precoAntigo.toFixed(2);
            const preco = product.preco.toFixed(2);
            const economia = (product.precoAntigo - product.preco).toFixed(2);

            return `
                <div class="product-item">
                    <h3>🔥 ${product.nome}</h3>
                    <p>De: <s>R$ ${precoAntigo}</s></p>
                    <p>Por: <strong>R$ ${preco}</strong></p>
                    <p>Economize R$ ${economia}</p>
                    <a href="${product.link_afiliado}" target="_blank">Comprar Agora</a>
                </div>
            `;
        }).join('');

        productList.innerHTML = html;
    }

    // Filtros e Buscas
    searchBar.addEventListener('input', () => {
        const searchQuery = searchBar.value.toLowerCase();
        const filtered = products.filter(product => 
            product.nome.toLowerCase().includes(searchQuery)
        );
        renderProducts(filtered);
    });

    sortFilter.addEventListener('change', () => {
        const sortOption = sortFilter.value;
        const sorted = [...products];

        if (sortOption === 'menorPreco') {
            sorted.sort((a, b) => a.preco - b.preco);
        } else if (sortOption === 'maiorPreco') {
            sorted.sort((a, b) => b.preco - a.preco);
        } else if (sortOption === 'maisRecente') {
            sorted.sort((a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro));
        }

        renderProducts(sorted);
    });
});
