document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const serverUrl = 'https://projetohunterback.onrender.com'; // URL do backend

    // Função para carregar os produtos na página oi
    loadProducts();

    // Evento para criar um novo produto
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const product = {
            nome: document.getElementById('nome').value,
            precoAntigo: parseFloat(document.getElementById('precoAntigo').value),
            preco: parseFloat(document.getElementById('preco').value),
            link_afiliado: document.getElementById('linkAfiliado').value
        };

        console.log('Enviando produto:', product);

        await addProduct(product);
        productForm.reset(); // Limpa o formulário após envio
    });

    // Função para adicionar produto
    async function addProduct(product) {
        try {
            const response = await fetch(`${serverUrl}/produtos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            });

            const responseData = await response.json();
            console.log('Resposta do servidor:', responseData);

            if (response.ok) {
                alert('Produto adicionado com sucesso!');
                await loadProducts(); // Atualiza a lista
            } else {
                console.error('Erro ao adicionar produto:', responseData);
                alert(`Erro ao adicionar produto: ${responseData.erro || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao comunicar com o servidor: ' + error.message);
        }
    }

    // Função para carregar os produtos
    async function loadProducts() {
        try {
            const response = await fetch(`${serverUrl}/produtos`);
            const products = await response.json();

            productList.innerHTML = products.map(product => {
                return `
                    <div class="product-item">
                        <h3>${product.nome}</h3>
                        <p>Preço Antigo: R$ ${product.precoAntigo.toFixed(2)}</p>
                        <p>Preço Atual: R$ ${product.preco.toFixed(2)}</p>
                        <p>Link: <a href="${product.link_afiliado}" target="_blank">${product.link_afiliado}</a></p>
                        <button onclick="deleteProduct('${product._id}')">Deletar</button>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productList.innerHTML = '<p>Erro ao carregar produtos</p>';
        }
    }

    // Função para deletar produto
    window.deleteProduct = async (id) => {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                const response = await fetch(`${serverUrl}/produtos/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Produto deletado com sucesso!');
                    await loadProducts();
                } else {
                    alert('Erro ao deletar produto');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao comunicar com o servidor');
            }
        }
    };
});
