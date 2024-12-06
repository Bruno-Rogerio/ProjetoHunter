document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const templateMessage = "🔥 Oferta imperdível: {nome} por apenas R$ {preco_atual}! Compre Agora!!: {link}";

    const serverUrl = 'https://projetohunterback.onrender.com'; // Altere para o URL correto do seu servidor

    // Carregar produtos do servidor
    loadProducts();

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const product = {
            nome: document.getElementById('nome').value,
            preco_antigo: parseFloat(document.getElementById('precoAntigo').value),
            preco_atual: parseFloat(document.getElementById('preco').value),
            link_afiliado: document.getElementById('linkAfiliado').value,
            template: templateMessage
        };
        console.log('Produto a ser enviado:', product);
        await addProduct(product);
        productForm.reset();
    });

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
                await loadProducts();
            } else {
                console.error('Erro ao adicionar produto:', responseData);
                alert(`Erro ao adicionar produto: ${responseData.erro || response.statusText}`);
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro ao comunicar com o servidor: ' + error.message);
        }
    }

    async function loadProducts() {
        try {
            const response = await fetch(`${serverUrl}/produtos`);
            const products = await response.json();

            productList.innerHTML = products.map(product => {
                const message = product.template
                    .replace('{nome}', product.nome)
                    .replace('{preco_antigo}', product.preco_antigo.toFixed(2))
                    .replace('{preco_atual}', product.preco_atual.toFixed(2))
                    .replace('{link}', product.link_afiliado);

                return `
                    <div class="product-item">
                        <h3>${product.nome}</h3>
                        <p>De: <span style="text-decoration: line-through; color: #999;">R$ ${product.preco_antigo.toFixed(2)}</span></p>
                        <p>Por: <span style="color: red; font-weight: bold;">R$ ${product.preco_atual.toFixed(2)}</span></p>
                        <p>Link: <a href="${product.link_afiliado}" target="_blank">${product.link_afiliado}</a></p>
                        <p>Mensagem: ${message}</p>
                        <button onclick="deleteProduct('${product._id}')">Deletar</button>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productList.innerHTML = '<p>Erro ao carregar produtos</p>';
        }
    }

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
