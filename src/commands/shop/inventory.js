module.exports = {
    name: 'inv',
    description: 'Muestra el inventario de un usuario',
    execute(message, args, { shop }) {
        shop.inventory(message, args);
    }
};
