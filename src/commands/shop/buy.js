module.exports = {
    name: 'buy',
    description: 'Compra un objeto de la tienda',
    execute(message, args, { shop }) {
        shop.buy(message, args);
    }
};
