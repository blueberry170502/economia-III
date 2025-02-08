const { Client, GatewayIntentBits } = require('discord.js');
const User = require('./models/user');

require('dotenv').config();

const TOKEN_BOT = process.env.TOKEN_BOT;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const users = new Map();

const getUser = (id) => {
    if (!users.has(id)) {
        users.set(id, new User(id));
    }
    return users.get(id);
};

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();
    const user = getUser(message.author.id);

    switch (command) {
        case '!work':
            user.work(message);
            break;
        case '!rob':
            user.rob(message, args);
            break;
        case '!dep':
            user.deposit(message, args);
            break;
        case '!ret':
            user.withdraw(message, args);
            break;
        case '!bal':
            user.balance(message, args);
            break;
    }
});

client.login(TOKEN_BOT)   
    .then(() => {
        console.log('Bot conectado correctamente!');
    })
    .catch(err => {
        console.error('Error al conectar el bot:', err);
    });
