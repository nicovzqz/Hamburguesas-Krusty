function loadProducts() {
    return fetch('../data/productos.json')
        .then(response => response.json())
        .then(data => {
            const products = {
                hamburguesas: [],
                bebidas: [],
                papas: []
            };

            data.forEach(product => {
                if (product.categoria === 'hamburguesas') {
                    products.hamburguesas.push(product);
                } else if (product.categoria === 'bebidas') {
                    products.bebidas.push(product);
                } else if (product.categoria === 'papas') {
                    products.papas.push(product);
                }
            });

            return products;
        })
        .catch(error => console.error('Error loading products:', error));
}

export { loadProducts };