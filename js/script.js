// array para armazenar os produtos
const carrinho = [];
let ingredientList = [
    { idIng: 1, nomeIng: "Bacon", precoIng: 4.50 },
    { idIng: 2, nomeIng: "Cebola Roxa", precoIng: 2.50 },
    { idIng: 3, nomeIng: "Mussarela 200g", precoIng: 5.50 },
    { idIng: 4, nomeIng: "Ovo", precoIng: 3.50 },
    { idIng: 5, nomeIng: "Hamburguer 150g", precoIng: 9.50 }
];
//closeModal
function closeModal() {
    //fecha modal
    let modalOpenIgredient = document.getElementById("product-modal");
    if (modalOpenIgredient) {
        modalOpenIgredient.classList.add("hidden");
    }
    //limpa campos
    const checkBoxes = document.querySelectorAll('input[name="options"]');
    checkBoxes.forEach(function (check) {
        check.checked = false;
    });
}
//open modal
function openModal(event) {
    event.preventDefault();
    exibirAdicionais();
    // Limpa o modal de qualquer produto anterior
    const titleModal = document.getElementById("product-name");
    const priceModal = document.getElementById("product-price");
    titleModal.innerText = '';
    priceModal.innerText = '';
    // Limpa os checkboxes selecionados anteriormente
    const checkBoxes = document.querySelectorAll('input[name="options"]');
    checkBoxes.forEach(function (check) {
        check.checked = false;
    });
    exibirAdicionais();
    // Abre modal e define o novo produto
    let modalOpenIgredient = document.getElementById("product-modal");
    if (modalOpenIgredient) {
        modalOpenIgredient.classList.remove("hidden");
    }
    const produtoNome = event.currentTarget.getAttribute("data-product-name");
    const produtoPrice = event.currentTarget.getAttribute("data-product-price");
    titleModal.innerText = produtoNome;
    priceModal.innerText = produtoPrice;
}
//exibir ingredientes
function exibirAdicionais() {
    const listAdicionais = document.getElementById("ingredient-container");
    listAdicionais.innerHTML = "";
    ingredientList.forEach(function (ingredient) {
        const label = document.createElement('label');
        label.classList.add('flex', 'items-center', 'space-x-2');
        label.innerHTML = `
            <input name="options" type="checkbox" id="ingredient-${ingredient.idIng}" data-id="${ingredient.idIng}" data-product-price="${ingredient.precoIng}">
            <label for="ingredient-${ingredient.idIng}"> ${ingredient.nomeIng} - R$ ${ingredient.precoIng.toFixed(2)}
            </label>
        `;
        listAdicionais.appendChild(label);
    });
    const checkBoxes = document.querySelectorAll('input[name="options"]');
    checkBoxes.forEach(function (checkBox) {
        checkBox.addEventListener('change', function () {
            const selected = document.querySelectorAll('input[name="options"]:checked');
            if (selected.length > 2) {
                Toastify({
                    text: "Você pode selecionar no máximo 2 ingredientes.",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "#dc2626",
                    },
                    onClick: function () { }
                }).showToast();
                // Desmarca o checkbox selecionado
                checkBox.checked = false;
            }
        });
    }); 
}
//add produtos carrinho
function addCarrinho(event) {
    event.preventDefault();
    // Captura o nome e o preço diretamente na função addCarrinho
    const nameProduct = document.getElementById('product-name').innerText || event.currentTarget.getAttribute('data-product-name');
    const priceProduct = parseFloat(document.getElementById('product-price').innerText.replace(/[^0-9,.-]+/g, '').replace(',', '.')) || parseFloat(event.currentTarget.getAttribute('data-product-price'));
    
    // Ingredientes selecionados
    const selectedIngredients = ingredientList.filter(function(ingredient) {
        const checkbox = document.getElementById(`ingredient-${ingredient.idIng}`);
        return checkbox && checkbox.checked;
    });

    // Preço total do produto com os ingredientes
    const totalProductPrice = selectedIngredients.reduce((total, ingredient) => total + ingredient.precoIng, priceProduct);

    // Notificação de produto adicionado ao carrinho
    Toastify({
        text: "Produto adicionado ao carrinho",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: { background: "#16a34a" },
        onClick: function () { }
    }).showToast();

    // Verificar se o item (com os mesmos ingredientes) já está no carrinho
    const itemNoCarrinho = carrinho.find(item => item.nomeProduto === nameProduct && JSON.stringify(item.ingredientes) === JSON.stringify(selectedIngredients));
    if (itemNoCarrinho) {
        itemNoCarrinho.quantity += 1;
    } else {
        carrinho.push({
            nomeProduto: nameProduct,
            precoProduto: totalProductPrice,
            ingredientes: selectedIngredients,
            type: 'Product',
            quantity: 1,
        });
    }
    
    atualizarCarrinho();
    closeModal();
}
//add bebidas
function addBebidasCarrinho(event) {
    event.preventDefault();
    const addProduct = event.target.closest(".add-to-cart-btn");
    const nameBebida = addProduct.getAttribute('data-name');
    const priceBebida = parseFloat(addProduct.getAttribute('data-price'));

    // Notificação de bebida adicionada ao carrinho
    Toastify({
        text: "Bebida adicionada ao carrinho",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: { background: "#16a34a" },
        onClick: function () { }
    }).showToast();

    // Adicionar a bebida ao carrinho
    const itemNoCarrinho = carrinho.find(item => item.nomeProduto === nameBebida);
    if (itemNoCarrinho) {
        itemNoCarrinho.quantity += 1;
    } else {
        carrinho.push({
            nomeProduto: nameBebida,
            precoProduto: priceBebida,
            type: 'Bebidas',
            quantity: 1,
        });
    }
    
    atualizarCarrinho();
    closeModal();
}
// atualiza carrinho
function atualizarCarrinho() {
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const cartItems = document.getElementById("cart-items");
    const taxaCash = parseFloat(document.getElementById("taxa-cash").innerText);
    cartItems.innerHTML = ""; //limpa html
    let totalCompra = taxaCash;
    carrinho.forEach(item => {
        const cartElement = document.createElement("div"); //criar nova div
        cartElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        // Verifica se há ingredientes associados ao item
        const ingredientesHTML = item.ingredientes && item.ingredientes.length > 0
            ? item.ingredientes.map(ing => `<span class="font-small text-base">Adicional: ${ing.nomeIng} - R$ ${ing.precoIng.toFixed(2)}</span>`).join('<br>')
            : '';
        cartElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium text-base">Produto: ${item.nomeProduto}</p>
                ${ingredientesHTML ? `${ingredientesHTML}<br>` : ''}
                <p class="font-medium text-base">Quantidade: ${item.quantity}</p>
                <p class="font-medium text-base mt-2">Total: R$ ${item.precoProduto.toFixed(2)}</p>
            </div>
            <div>
                <button class="btn-remove" data-remove="${item.nomeProduto}">Remover</button>
            </div>
        </div>`;
        // Calcula o total para o carrinho
        totalCompra += item.precoProduto * item.quantity;
        cartItems.appendChild(cartElement);
    });
    // Atualiza os valores exibidos no carrinho
    cartTotal.innerText = totalCompra.toFixed(2); // Atualiza o total
    cartCount.innerText = carrinho.length; // Atualiza a contagem de itens
    // Adiciona evento de click aos botões "Remover"
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', removeCarrinho);
    });
}
// remover carrinho
function removeCarrinho(event) {
    event.preventDefault();
    const btnRemove = event.target.getAttribute('data-remove');
    // Encontrar o índice do item no carrinho
    const index = carrinho.findIndex(item => item.nomeProduto === btnRemove);
    if (index !== -1) {
        const item = carrinho[index];
        if (item.quantity > 1) {
            // Se houver mais de uma unidade, reduz a quantidade
            item.quantity -= 1;
        } else {
            // Se houver apenas uma unidade, remove o item do carrinho
            carrinho.splice(index, 1);
        }
        atualizarCarrinho(); // Atualiza a exibição do carrinho
    }
}
//enviar pedido
function enviarPedido() {
    const observacaoCliente = document.getElementById("observacao").value;
    const enderecoCliente = document.getElementById("address").value;
    const modalAlert = document.getElementById("address-warn");
    const formaPagamento = document.getElementById("payment-method").value;
    const taxaEntrega = parseFloat(document.getElementById("taxa-cash").innerText);
    // Verificando se o carrinho está vazio ou se o endereço não foi preenchido
    if (carrinho.length === 0) return;
    if (enderecoCliente === "") {
        modalAlert.classList.remove("hidden");
        document.getElementById("address").classList.add("border-red-500");
        return;
    } else {
        modalAlert.classList.add("hidden");
        document.getElementById("address").classList.remove("border-red-500");
    }
    // Iniciar mensagem do pedido
    const phone = "5511976696658";
    let mensagem = 'Olá, gostaria de fazer um pedido:\n\n';
    // Adicionar os produtos e ingredientes à mensagem
    carrinho.forEach(item => {
        mensagem += `Produto: ${item.nomeProduto}\n`;
        if (item.ingredientes && item.ingredientes.length > 0) {
            item.ingredientes.forEach(ing => {
                mensagem += `  - Adicional: ${ing.nomeIng} - R$ ${ing.precoIng.toFixed(2)}\n`;
            });
        }
        mensagem += `Quantidade: ${item.quantity}\n`;
        mensagem += `Preço: R$ ${(item.precoProduto).toFixed(2)}\n\n`;
    });
    // Calcular o total da compra
    let totalCompra = carrinho.reduce((total, item) => total + item.precoProduto * item.quantity, taxaEntrega);
    mensagem += `Taxa Entrega: R$ ${taxaEntrega.toFixed(2)}\n\n`;
    mensagem += `Total: R$ ${totalCompra.toFixed(2)}\n\n`;
    // Adicionar outras informações à mensagem
    mensagem += `Forma de Pagamento: ${formaPagamento}\n\n`;
    mensagem += `Endereço de entrega: ${enderecoCliente}\n\n`;
    mensagem += `Observação: ${observacaoCliente}\n\n`;
    mensagem += 'Por favor, confirme o recebimento deste pedido.';
    // Encodificar e enviar a mensagem via WhatsApp
    const encodedMessage = encodeURIComponent(mensagem);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, '_blank');
}
function modalCarrinho(event) {
    event.preventDefault();
    atualizarCarrinho(); // Atualiza o carrinho antes de exibir o modal
    const btnCarrinho = document.getElementById("cart-btn");
    const btnModal = document.getElementById("cart-modal");
    const btnFechar = document.getElementById("close-modal-btn");
    if (event.target === btnCarrinho) {
        btnModal.style.display = "flex"; // Exibe o modal do carrinho
    }
    if (event.target === btnFechar) {
        btnModal.style.display = "none"; // Fecha o modal do carrinho
    }
}
// hora de fechar
function checkOpenRestaurant() {
    const horaOpen = document.getElementById("data-span");
    const overlay = document.getElementById("overlay");
    const data = new Date();
    const hora = data.getHours();
    // if(hora >= 17 && hora < 22){
    //     horaOpen.classList.remove("bg-red-600");
    //     horaOpen.classList.add("bg-green-600");
    //     overlay.classList.add("hidden");
    // }else {
    //     horaOpen.classList.remove("bg-green-600");
    //     horaOpen.classList.add("bg-red-600");
    //     overlay.classList.remove("hidden");
    // }
}
checkOpenRestaurant();
//cancelar i
document.getElementById("btn-cancelar-ingredient").addEventListener("click", closeModal);
//add ingredientes
document.getElementById("btn-add-ingredient").addEventListener("click", addCarrinho); //addIngredienteCarrinho vitor
document.querySelectorAll('input[name="options"]').forEach(function (input) {
    input.addEventListener("click", addIngredientes);
});
// abrir modal
document.getElementById("cart-btn").addEventListener("click", modalCarrinho);
// fechar modal
document.getElementById("close-modal-btn").addEventListener("click", modalCarrinho);
// add carrinho
document.querySelectorAll(".add-info-btn").forEach(function (botao) {
    botao.addEventListener("click", addBebidasCarrinho);
});
//btn enviar pedido
document.getElementById("checkout-btn").addEventListener("click", enviarPedido);
