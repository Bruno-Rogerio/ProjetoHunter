document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const templateMessage = "🔥 Oferta imperdível: {nome} por apenas R$ {preco}! Confira: {link}";
    const serverUrl = 'http://localhost:5000'; // Altere para o URL do seu servidor

    // Carregar produtos do servidor
    loadProducts();

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const product = {
            nome: document.getElementById('nome').value,
            preco: parseFloat(document.getElementById('preco').value),
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
                    .replace('{preco}', product.preco.toFixed(2))
                    .replace('{link}', product.link_afiliado);

                return `
                    <div class="product-item">
                        <h3>${product.nome}</h3>
                        <p>Preço: R$ ${product.preco.toFixed(2)}</p>
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
