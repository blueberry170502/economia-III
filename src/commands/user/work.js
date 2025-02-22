module.exports = {
    name: 'work',
    description: 'Realiza un trabajo para ganar dinero',
    execute(message, args, { user }) {
        user.work(message);
    }
};
