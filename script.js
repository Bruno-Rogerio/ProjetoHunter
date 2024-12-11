document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const formSection = document.getElementById('formSection');
    const marketplaceSection = document.getElementById('marketplaceSection');
    const searchBar = document.getElementById('searchBar');
    const sortFilter = document.getElementById('sortFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const productList = document.getElementById('productList'); // Div para os produtos
    const feedbackMessage = document.getElementById('feedbackMessage'); // Adicione no HTML, se necessário
    const serverUrl = 'https://projetohunterback.onrender.com';

    let products = []; // Array para armazenamento local dos produtos

    // Alternar entre Cadastro e Marketplace
    document.getElementById('showForm').addEventListener('click', () => {
        formSection.style.display = 'block';  // Mostra a seção de cadastro
        marketplaceSection.style.display = 'none';  // Esconde o marketplace
    });

    document.getElementById('showMarketplace').addEventListener('click', () => {
        formSection.style.display = 'none';  // Esconde a seção de cadastro
        marketplaceSection.style.display = 'block';  // Mostra o marketplace
        loadProducts(); // Atualiza os produtos toda vez que o marketplace for aberto
    });

    // Adicionar Produto (submit do formulário)
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Previne recarregamento da página
        const nome = document.getElementById('nome').value.trim();
        const precoAntigo = parseFloat(document.getElementById('precoAntigo').value);
        const preco = parseFloat(document.getElementById('preco').value);
        const linkAfiliado = document.getElementById('linkAfiliado').value.trim();
        const categoria = document.getElementById('categoria').value.trim();

        // Validação básica
        if (!nome || isNaN(precoAntigo) || isNaN(preco) || precoAntigo <= preco || !categoria || !linkAfiliado) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        // Objeto com dados do produto
        const product = {
            nome,
            precoAntigo,
            preco,
            link_afiliado: linkAfiliado,
            categoria,
            template: `🔥 OFERTA IMPERDÍVEL!\n\n${nome}\n\n💰 De: R$${precoAntigo}\n💥 Por apenas: R$${preco}\n\nEconomize R$${(precoAntigo - preco).toFixed(2)}!\n\n🛒 Compre agora: ${linkAfiliado}`
        };

        try {
            const response = await fetch(`${serverUrl}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                alert('Produto cadastrado com sucesso!');
                productForm.reset(); // Limpa o formulário
                loadProducts(); // Atualiza lista no marketplace
            } else {
                const { erro } = await response.json();
                console.error('Erro ao adicionar produto:', erro);
                alert(`Erro ao adicionar produto: ${erro}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao comunicar com o servidor.');
        }
    });

    // Carregar Produtos
    async function loadProducts() {
        try {
            productList.innerHTML = '<p>Carregando produtos...</p>'; // Placeholder enquanto carrega
            const response = await fetch(`${serverUrl}/produtos`);
            
            if (!response.ok) {
                throw new Error('Falha ao carregar produtos do servidor.');
            }

            products = await response.json(); // Atualiza array local
            populateCategories(products); // Popula o dropdown de categorias
            renderProducts(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productList.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        }
    }

    // Popula o dropdown de categorias
    function populateCategories(products) {
        const categories = new Set(products.map(product => product.categoria));
        categoryFilter.innerHTML = '<option value="Todas">Todas as Categorias</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Renderizar Produtos
    function renderProducts(filteredProducts) {
        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p>Nenhum produto encontrado!</p>';
            return;
        }

        const html = filteredProducts.map(product => {
            const precoAntigo = product.precoAntigo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const precoAtual = product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const economia = (product.precoAntigo - product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const template = `🔥 OFERTA IMPERDÍVEL!\n\n${product.nome}\n\n💰 De: ${precoAntigo}\n💥 Por apenas: ${precoAtual}\n\nEconomize ${economia}!\n\n🛒 Compre agora pelo link abaixo:\n\nLink: ${product.link_afiliado}`;

            return `
                <div class="product-item">
                    <pre>${template}</pre> <!-- Renderiza o template diretamente -->
                </div>
            `;
        }).join('');

        productList.innerHTML = html; // Insere os produtos no DOM
    }

    // Filtros e Buscas
    searchBar.addEventListener('input', () => {
        filterProducts();
    });

    sortFilter.addEventListener('change', () => {
        filterProducts();
    });

    categoryFilter.addEventListener('change', () => {
        filterProducts();
    });

    function filterProducts() {
        const searchQuery = searchBar.value.toLowerCase();
        const sortOption = sortFilter.value;
        const selectedCategory = categoryFilter.value;

        let filtered = products.filter(product => 
            product.nome.toLowerCase().includes(searchQuery) &&
            (selectedCategory === 'Todas' || product.categoria === selectedCategory)
        );

        if (sortOption === 'menorPreco') {
            filtered.sort((a, b) => a.preco - b.preco);
        } else if (sortOption === 'maiorPreco') {
            filtered.sort((a, b) => b.preco - a.preco);
        } else if (sortOption === 'maisRecente') {
            filtered.sort((a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro));
        }

        renderProducts(filtered);
    }
});
