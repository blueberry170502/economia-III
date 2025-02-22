module.exports = {
    name: 'sell',
    description: 'Vende un objeto de tu inventario a la tienda',
    execute(message, args, { shop }) {
        shop.sell(message, args);
    }
};
