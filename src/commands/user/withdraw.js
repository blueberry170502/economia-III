module.exports = {
    name: 'ret',
    description: 'Retira dinero del banco',
    execute(message, args, { user }) {
        user.withdraw(message, args[0]);
    }
};