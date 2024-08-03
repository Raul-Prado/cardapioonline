// array
const carrinho = [];
//const ingredientes = []
//closeModal
// function closeModal(event) {
//     event.preventDefault();
//     //fecha modal
//     const modalOpenIgredient = document.getElementById("product-modal");
//     if (modalOpenIgredient) {
//         modalOpenIgredient.classList.add("hidden");
//     }
// }
//open modal
// function openModal(event) {
//     event.preventDefault();
//     //abre modal
//     const modalOpenIgredient = document.getElementById("product-modal");
//     if (modalOpenIgredient) {
//         modalOpenIgredient.classList.remove("hidden");
//     }
//     // 
//     const infoProduct = document.querySelectorAll(".add-to-cart-btn");
//     infoProduct.forEach(function (listProduct) {
//         listProduct.addEventListener("click", function (event) {
//             event.preventDefault(); // Evita comportamento padrão, se necessário
//             // Pega os atributos do botão
//             const productSelecionado = listProduct.getAttribute("data-name");
//             const produtoPreco = parseFloat(listProduct.getAttribute("data-price"));
//             const idDiv = document.getElementById("product-name");

//             // Cria uma nova div para exibir os dados
//             const novaDiv = document.createElement("div");
//             novaDiv.classList.add("flex", "justify-between", "mb-4", "flex-col");

//             idDiv.innerHTML = "";

//             novaDiv.innerHTML = `
//             <div class="flex items-center justify-between">
//                 <div>
//                     <p class="font-bold text-base">Produto: ${productSelecionado}</p>
//                     <p class="font-bold text-base">Preço: R$ ${produtoPreco.toFixed(2)}</p>
//                 </div>
//             </div>`;

//             // Adiciona a nova div ao DOM (por exemplo, no final do body)
//             idDiv.appendChild(novaDiv);
//         });
//     });
// }
//add ingredientes
function productIngredientes(event) {
    event.preventDefault();

    // Seleciona o botão que disparou o evento
    const btn = event.currentTarget.closest('.productIngrediente').nextElementSibling.querySelector('.add-to-cart-btn');

    // Pega os atributos do botão
    const productSelecionado = btn.getAttribute("data-name");
    const produtoPreco = parseFloat(btn.getAttribute("data-price"));

    // Cria uma nova div para exibir os dados
    const productElement = document.createElement("div");
    productElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    productElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium text-base">Produto: ${productSelecionado}</p>
                <p class="font-medium text-base">Preço: R$ ${produtoPreco.toFixed(2)}</p>
            </div>
        </div>`;

    // Adiciona a nova div ao DOM (por exemplo, no final do body)
    document.body.appendChild(productElement);

    // Apenas para demonstração, pode remover o alert
    alert(`Ingrediente: ${productSelecionado}, Preço: R$ ${produtoPreco.toFixed(2)}`);
}
//add ingredientes
// function addIngredientes(event) {
//     event.preventDefault();
//     const checkBoxes = document.querySelectorAll('input[name="options"]:checked');
//     //ate 2 ingredientes
//     if (checkBoxes.checked || checkBoxes.length > 2) {
//         Toastify({
//             text: "Você pode selecionar no máximo 2 ingredientes.",
//             duration: 3000,
//             close: true,
//             gravity: "top",
//             position: "right",
//             stopOnFocus: true,
//             style: {
//                 background: "#dc2626",
//             },
//             onClick: function () { }
//         }).showToast();
//     } else {
//         checkBoxes.forEach(function (check) {
//             const productSelecionado = check.nextElementSibling.getAttribute("data-ingredient");
//             const produtoPreco = parseFloat(check.nextElementSibling.nextElementSibling.getAttribute("data-ingredient-price"));
//             alert(`Ingrediente: ${productSelecionado}, Preço: R$ ${produtoPreco.toFixed(2)}`);
//         });
//     }
//     if (checkBoxes.checked || checkBoxes.length <= 2) {
//         Toastify({
//             text: "Você adicionou novo ingrediente.",
//             duration: 3000,
//             close: true,
//             gravity: "top",
//             position: "right",
//             stopOnFocus: true,
//             style: {
//                 background: "#16a34a",
//             },
//             onClick: function () { }
//         }).showToast();
//     }
// }
//add produtos carrinho
function addCarrinho(event) {
    event.preventDefault();
    const addProduct = event.target.closest(".add-to-cart-btn");
    const nameProduct = addProduct.getAttribute("data-name");
    const priceProduct = parseFloat(addProduct.getAttribute("data-price"));
    if (addProduct) {
        Toastify({
            text: "Produto adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#16a34a",
            },
            onClick: function () { } // Callback after click
        }).showToast();
    };

    //verificar se o item está no carrinho
    const itemNoCarrinho = carrinho.find(item => item.nameProduct === nameProduct)

    if (itemNoCarrinho) {
        // Se o item já estiver no carrinho, você pode atualizar a quantidade 
        itemNoCarrinho.quantity += 1;
    } else {
        //object
        carrinho.push({
            nameProduct,
            priceProduct,
            quantity: 1,
        });
    }
    atualizarCarrinho();
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

        cartElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-medium text-base">Produto ${item.nameProduct}</p>
            <p class="font-medium text-base">Qantidade ${item.quantity}</p>
            <p class="font-medium text-base mt-2">R$ ${item.priceProduct.toFixed(2)}</p>
            </div>
            <div>
                <button class="btn-remove" data-remove="${item.nameProduct}">Remover</button>
            </div>
        </div>`
        //total produtos
        totalCompra += item.priceProduct * item.quantity;
        cartTotal.innerHTML = totalCompra.toFixed(2);
        // total carrinho
        cartCount.innerHTML = carrinho.length;
        cartItems.appendChild(cartElement);
    });
    // Adiciona evento de click aos botões "Remover"
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', removeCarrinho);
    });
}
// remover carrinho
function removeCarrinho(event) {
    event.preventDefault();
    const btnRemove = event.target.getAttribute('data-remove');
    const precoTotal = document.getElementById("cart-total");
    const carrinhoCount = document.getElementById("cart-count");

    const index = carrinho.findIndex(item => item.nameProduct === btnRemove);

    if (index !== -1) {
        const item = carrinho[index];
        if (item.quantity > 1) {
            item.quantity -= 1; // Atualiza a quantidade
            atualizarCarrinho();
            return;
        } else {
            carrinho.splice(index, 1); // Remove o item
            precoTotal.innerHTML ="";
            carrinhoCount.innerHTML = 0;
            atualizarCarrinho();
        }
    }
}
//enviar pedido
function enviarPedido() {
    const observacaoCliente = document.getElementById("observacao");
    const enderecoCliente = document.getElementById("address");
    const modalAlert = document.getElementById("address-warn");
    const formaPagamento = document.getElementById("payment-method").value;
    const taxaEntrega = parseFloat(document.getElementById("taxa-cash").innerText);
    // const opcaoSelecionada = formaPagamento.options[formaPagamento.selectedIndex];
    // const textoOpcao = opcaoSelecionada.text;

    //verificando carrinho
    if (carrinho.length === 0) return;
    if (enderecoCliente.value === "") {
        modalAlert.classList.remove("hidden");
        enderecoCliente.classList.add("border-red-500");
        return;
    } else {
        enderecoCliente.classList.remove("border-red-500");
        modalAlert.classList.add("hidden");
    }

    //enviar pedido
    const phone = "5511951354414";
    let mensagem = 'Olá, gostaria de fazer um pedido:\n\n';

    carrinho.forEach(item => {
        mensagem += `Produto: ${item.nameProduct}\n`;
        mensagem += `Quantidade: ${item.quantity}\n`;
        mensagem += `Preço: R$ ${item.priceProduct.toFixed(2)}\n\n`;
    });

    mensagem += `Observaçãos: ${observacaoCliente.value}\n\n`;

    const totalCompra = carrinho.reduce((total, item) => total + taxaEntrega + item.priceProduct * item.quantity, 0);
    mensagem += `Taxa Entrega: R$ ${taxaEntrega.toFixed(2)}\n\n`;
    mensagem += `Total: R$ ${totalCompra.toFixed(2)}\n\n`;
    mensagem += `Forma de Pagamento: ${formaPagamento}\n\n`;
    mensagem += `Endereço de entrega: ${enderecoCliente.value}\n\n`;
    mensagem += 'Por favor, confirme o recebimento deste pedido.';

    const encodedMessage = encodeURIComponent(mensagem);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(url, '_blank');

    //const message = encodeURIComponent(carrinho);
    //window.open("https://wa.me/${}");
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

function modalCarrinho(event) {
    atualizarCarrinho();
    event.preventDefault();
    const btnCarrinho = document.getElementById("cart-btn");
    const btnModal = document.getElementById("cart-modal");
    const btnFechar = document.getElementById("close-modal-btn");
    if (event.target === btnCarrinho) {
        btnModal.style.display = "flex";
    }
    if (event.target === btnFechar) {
        btnModal.style.display = "none"
    }
}
//cancelar i
//document.getElementById("btn-cancelar-ingredient").addEventListener("click", closeModal);
//add ingredientes
//document.getElementById("btn-add-ingredient").addEventListener("click", atualizarCarrinho);
// abrir modal
document.getElementById("cart-btn").addEventListener("click", modalCarrinho);
// fechar modal
document.getElementById("close-modal-btn").addEventListener("click", modalCarrinho);
// add carrinho
document.getElementById("menu").addEventListener("click", addCarrinho);
//btn enviar pedido
document.getElementById("checkout-btn").addEventListener("click", enviarPedido);
