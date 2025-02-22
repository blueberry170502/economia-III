module.exports = {
    name: 'rob',
    description: 'Roba dinero a otro usuario',
    execute(message, args, { user }) {
        user.rob(message, args);
    }
};
