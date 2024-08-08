function preencherEndereco() {
    const valorInput = document.getElementById('address');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const apiKey = '4c03e99f7e014dc7b4545502933593b0'; // Substitua com sua chave de API

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const endereco = data.results[0].formatted;
                valorInput.value = endereco;
            })
            .catch(error => console.error('Erro ao converter coordenadas para endereço:', error));
    }

    function error() {
        alert('Não foi possível obter a sua localização.');
    }
}
document.getElementById("address").addEventListener("click", preencherEndereco);