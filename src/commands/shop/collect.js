module.exports = {
    name: 'col',
    description: 'Recoge las ganancias de tus objetos',
    execute(message, args, { shop }) {
        shop.collect(message);
    }
};
