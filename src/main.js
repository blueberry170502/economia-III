const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const User = require('./models/user');
const Shop = require('./models/Shop');
const Moderador = require('./models/Moderador');

require('dotenv').config();

const TOKEN_BOT = process.env.TOKEN_BOT;


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', folder, file));
        client.commands.set(command.name, command);
    }
}

const users = new Map();
const shop = new Shop();
const moderador = new Moderador();

const getUser = (id) => {
    if (!users.has(id)) {
        users.set(id, new User(id));
    }
    return users.get(id);
};

client.once('ready', () => {
    console.log('✅ Bot conectado correctamente!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const user = getUser(message.author.id);

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    try {
        command.execute(message, args, { user, shop, client, moderador });
    } catch (error) {
        console.error(error);
        message.reply('❌ Ha ocurrido un error al ejecutar el comando.');
    }
});

client.login(TOKEN_BOT).catch(err => {
    console.error('❌ Error al conectar el bot:', err);
});

