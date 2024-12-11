<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestão de Produtos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- Menu de Navegação -->
        <nav>
            <button id="showForm">Cadastro de Produtos</button>
            <button id="showMarketplace">Marketplace</button>
        </nav>

        <!-- Seção de Cadastro -->
        <div id="formSection">
            <h1>Cadastro de Produtos</h1>
            <form id="productForm">
                <!-- Campos do formulário -->
                <label for="nome">Nome do Produto:</label>
                <input type="text" id="nome" name="nome" placeholder="Nome do Produto" required>
                
                <label for="precoAntigo">Preço Antigo:</label>
                <input type="number" id="precoAntigo" name="precoAntigo" placeholder="Preço Antigo" step="0.01" required>
                
                <label for="preco">Preço Atual:</label>
                <input type="number" id="preco" name="preco" placeholder="Preço Atual" step="0.01" required>
                
                <label for="linkAfiliado">Link Afiliado:</label>
                <input type="url" id="linkAfiliado" name="linkAfiliado" placeholder="Link Afiliado" required>
                
                <label for="categoria">Categoria:</label>
                <select id="categoria" name="categoria" required>
                    <option value="" disabled selected>Selecione uma Categoria</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Moda">Moda</option>
                    <option value="Casa e Cozinha">Casa e Cozinha</option>
                    <option value="Beleza">Beleza</option>
                    <option value="Jóias">Jóias</option>
                    <option value="Outros">Outros</option>
                </select>
                
                <button type="submit">Adicionar Produto</button>
            </form>
        </div>

        <!-- Seção do Marketplace -->
        <div id="marketplaceSection" style="display: none;">
            <h1>Marketplace</h1>
            <!-- Mensagem de feedback (erro ou status) -->
            <div id="feedbackMessage" style="color: red; margin-bottom: 10px;"></div>
            
            <!-- Barra de Busca e Filtros -->
            <div class="filters">
                <input type="text" id="searchBar" placeholder="Buscar Produto..." />
                <select id="sortFilter">
                    <option value="maisRecente">Mais Recentes</option>
                    <option value="menorPreco">Menor Preço</option>
                    <option value="maiorPreco">Maior Preço</option>
                </select>
                <!-- Dropdown de Categorias -->
                <select id="categoryFilter">
                    <option value="Todas">Todas as Categorias</option>
                </select>
            </div>
            
            <!-- Lista de Produtos -->
            <div id="productList"></div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
