module.exports = {
    name: 'dep',
    description: 'Deposita dinero en el banco',
    execute(message, args, { user }) {
        user.deposit(message, args[0]);
    }
};
