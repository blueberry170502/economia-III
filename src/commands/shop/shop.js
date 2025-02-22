module.exports = {
    name: 'shop',
    description: 'Muestra la tienda con los objetos disponibles',
    execute(message, args, { shop }) {
        shop.shop(message);
    }
};
