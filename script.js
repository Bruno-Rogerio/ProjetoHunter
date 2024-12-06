<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produtos</title>
    <style>
        .product-item {
            border: 1px solid #ddd;
            padding: 16px;
            margin: 8px 0;
        }
        .product-item h3 {
            margin: 0;
            font-size: 1.5em;
        }
        .product-item p {
            margin: 4px 0;
        }
        .product-item button {
            margin-top: 10px;
            padding: 8px 16px;
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
        }
        .product-item button:hover {
            background-color: darkred;
        }
    </style>
</head>
<body>
    <div id="product-list"></div>

    <script>
        const serverUrl = 'https://projetohunterback.onrender.com'; // Altere para o seu servidor

        const productList = document.getElementById('product-list');

        async function loadProducts() {
            try {
                const response = await fetch(`${serverUrl}/produtos`);
                const products = await response.json();
                console.log('Produtos recebidos:', products);  // Verifique o conteúdo recebido do backend

                if (response.ok) {
                    productList.innerHTML = products.map(product => {
                        // Substituir os placeholders no template
                        const message = product.template
                            .replace('{nome}', product.nome)
                            .replace('{preco_antigo}', product.precoAntigo.toFixed(2))  // Use o nome correto do campo
                            .replace('{preco_atual}', product.preco.toFixed(2))          // Use o nome correto do campo
                            .replace('{link}', product.link_afiliado);

                        return `
                            <div class="product-item">
                                <h3>${product.nome}</h3>
                                <p>De: <span style="text-decoration: line-through; color: #999;">R$ ${product.precoAntigo.toFixed(2)}</span></p>
                                <p>Por: <span style="color: red; font-weight: bold;">R$ ${product.preco.toFixed(2)}</span></p>
                                <p>Link: <a href="${product.link_afiliado}" target="_blank">${product.link_afiliado}</a></p>
                                <p>Mensagem: ${message}</p>
                                <button onclick="deleteProduct('${product._id}')">Deletar</button>
                            </div>
                        `;
                    }).join('');
                } else {
                    throw new Error('Erro ao carregar produtos');
                }
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
                productList.innerHTML = '<p>Erro ao carregar produtos</p>';
            }
        }

        // Chama a função para carregar os produtos assim que a página for carregada
        loadProducts();
    </script>
</body>
</html>
