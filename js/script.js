




const btnFinalizar = document.getElementById("checkout-btn");




// array
const carrinho = [];

function addCarrinho(event){
    event.preventDefault();
    const addProduct = event.target.closest(".add-to-cart-btn");
    const nameProduct = addProduct.getAttribute("data-name");
    const priceProduct = parseFloat(addProduct.getAttribute("data-price"));
    //alert("Produto: " + nameProduct + " Preço: " + priceProduct);

    if(addProduct){
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
            onClick: function(){} // Callback after click
          }).showToast(); 
    };

    //verificar se o item está no carrinho
    const itemNoCarrinho = carrinho.find(item => item.nameProduct === nameProduct)

    if(itemNoCarrinho){
        // Se o item já estiver no carrinho, você pode atualizar a quantidade 
        itemNoCarrinho.quantity += 1;
    }else{
        //object
        carrinho.push({
            nameProduct,
            priceProduct,
            quantity: 1,
        });
    }
    atualizarCarrinho();
}

function atualizarCarrinho(){
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
        totalCompra += item.priceProduct*item.quantity;
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

function removeCarrinho(event){
    event.preventDefault();
    const btnRemove = event.target.getAttribute('data-remove');
    const precoTotal = document.getElementById("cart-total");
    
    const index = carrinho.findIndex(item => item.nameProduct === btnRemove);
    
    if(index !== -1){
        const item = carrinho[index];
        if(item.quantity > 1){
            item.quantity -= 1; // Atualiza a quantidade
            atualizarCarrinho();
            return;
        } else {
            carrinho.splice(index, 1); // Remove o item
            atualizarCarrinho();
        }
    }
}

function enviarPedido(){
    const observacaoCliente = document.getElementById("observacao");
    const enderecoCliente = document.getElementById("address");
    const modalAlert = document.getElementById("address-warn");
    //verificando carrinho
    if(carrinho.length === 0) return;
    if(enderecoCliente.value === ""){
        modalAlert.classList.remove("hidden");
        enderecoCliente.classList.add("border-red-500");
        return;
    }else{
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

    const totalCompra = carrinho.reduce((total, item) => total + item.priceProduct * item.quantity, 0);
    mensagem += `Total: R$ ${totalCompra.toFixed(2)}\n\n`;
    mensagem += `Endereço de entrega: ${enderecoCliente.value}\n\n`;
    mensagem += 'Por favor, confirme o recebimento deste pedido.';

    const encodedMessage = encodeURIComponent(mensagem);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.open(url, '_blank');

    //const message = encodeURIComponent(carrinho);
    //window.open("https://wa.me/${}");
}

function checkOpenRestaurant(){
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

function modalCarrinho(event){
    atualizarCarrinho();
    event.preventDefault();
    const btnCarrinho = document.getElementById("cart-btn");
    const btnModal = document.getElementById("cart-modal");
    const btnFechar = document.getElementById("close-modal-btn");
    if(event.target === btnCarrinho){
        btnModal.style.display="flex";
    }
    if(event.target === btnFechar){
        btnModal.style.display="none"
    }
}
// abrir modal
document.getElementById("cart-btn").addEventListener("click", modalCarrinho);
// fechar modal
document.getElementById("close-modal-btn").addEventListener("click", modalCarrinho);
// add carrinho
document.getElementById("menu").addEventListener("click", addCarrinho);
//btn enviar pedido
document.getElementById("checkout-btn").addEventListener("click", enviarPedido);
