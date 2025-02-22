module.exports = {
    name: 'bal',
    description: 'Muestra tu balance o el de otro usuario',
    execute(message, args, { user }) {
        user.balance(message);
    }
};
