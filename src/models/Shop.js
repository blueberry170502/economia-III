const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const DatabaseManager = require('./DatabaseManager');
const TimeoutManager = require('./TimeoutManager');
const USER_FILE = 'data/economy.json';
const { errorEmbed } = require('../utils/utils');

const timeoutManager = new TimeoutManager();

class Shop {
    constructor() {
        this.db = new DatabaseManager('data/shop.json');
        this.shopItems = this.db.data;
    }

    save() {
        this.db.saveData();
    }

    checkTimeout(userId, actionType, timeout, message) {
        return timeoutManager.checkTimeout(userId, actionType, timeout, message);
    }

    inventory(message, args) {
        const targetUser = message.mentions.users.first() || message.author;
        const economy = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
        const user = economy[targetUser.id] || { inventory: {} };
        
        const inventoryList = Object.entries(user.inventory).map(([id, amount]) => {
            const item = this.shopItems[id];
            return item ? `**${item.name}** x${amount}\n🔹 ${item.description}\n💰 Genera: ${item.earnings}/día` : null;
        }).filter(Boolean).join('\n\n') || 'No tienes objetos.';
        
        const embed = new EmbedBuilder()
            .setColor('#0077ff')
            .setTitle(`Inventario de ${targetUser.username}`)
            .setDescription(inventoryList)
            .setFooter({ text: 'Economía III' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }

    shop(message) {
        const shopList = Object.entries(this.shopItems).map(([id, item]) =>
            `**${id}. ${item.name}** - 💵${item.price} | Stock: ${item.stock} | 💰 Genera: ${item.earnings}/día\n${item.description}`
        ).join('\n\n');
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('Tienda')
            .setDescription(shopList)
            .setFooter({ text: 'Economía III' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }

    collect(message) {
        const userId = message.author.id;
        if (!this.checkTimeout(userId, 'collect', 86400000, message)) return;

        const economy = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
        const user = economy[userId] || { inventory: {}, bank: 0 };

        
        let totalEarnings = 0;
        Object.entries(user.inventory).forEach(([id, amount]) => {
            const item = this.shopItems[id];
            if (item) totalEarnings += item.earnings * amount;
        });

        user.bank += totalEarnings;
        economy[userId] = user;
        fs.writeFileSync(USER_FILE, JSON.stringify(economy, null, 2));
        
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Recolección de ganancias')
            .setDescription(`Has recolectado 💵${totalEarnings} en ganancias, depositadas en tu banco.`)
            .setFooter({ text: 'Economía III' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }

    sell(message, args) {
        const userId = message.author.id;
        const itemId = args[0];
        const amount = args[1] ? parseInt(args[1], 10) : 1;
        
        if (!this.shopItems[itemId]) {
            return message.reply({ embeds: [errorEmbed("El objeto no existe en la tienda.")] });
        }
        
        const economy = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
        const user = economy[userId] || { inventory: {}, wallet: 0 };
        
        if (!user.inventory[itemId] || user.inventory[itemId] < amount) {
            return message.reply({ embeds: [errorEmbed("No tienes suficientes unidades de este objeto para vender.")] });
        }
        
        const item = this.shopItems[itemId];
        const sellPrice = Math.floor(item.price * 0.7) * amount;
        
        user.inventory[itemId] -= amount;
        if (user.inventory[itemId] <= 0) delete user.inventory[itemId];
        
        user.wallet += sellPrice;
        item.stock += amount;
        
        economy[userId] = user;
        fs.writeFileSync(USER_FILE, JSON.stringify(economy, null, 2));
        this.save();
        
        const embed = new EmbedBuilder()
            .setColor('#ff6600')
            .setTitle('Venta realizada')
            .setDescription(`Has vendido ${amount}x ${item.name} por 💵${sellPrice}.`)
            .setFooter({ text: 'Economía III' })
            .setTimestamp();
        
        message.reply({ embeds: [embed] });
    }

    buy(message, args) {
        const userId = message.author.id;
        const itemId = args[0];
        const amount = args[1] ? parseInt(args[1], 10) : 1;

        if (!this.shopItems[itemId]) {
            return message.reply({ embeds: [errorEmbed("El objeto no existe en la tienda.")] });
        }

        const item = this.shopItems[itemId];
        const totalPrice = item.price * amount;

        const economy = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
        const user = economy[userId] || { inventory: {}, wallet: 0 };

        if (user.wallet < totalPrice) {
            return message.reply({ embeds: [errorEmbed("No tienes suficiente dinero para comprar este objeto.")] });
        }

        if (item.stock < amount) {
            return message.reply({ embeds: [errorEmbed("No hay suficiente stock de este objeto.")] });
        }

        user.wallet -= totalPrice;
        user.inventory[itemId] = (user.inventory[itemId] || 0) + amount;
        item.stock -= amount;

        economy[userId] = user;
        fs.writeFileSync(USER_FILE, JSON.stringify(economy, null, 2));
        this.save();

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Compra realizada')
            .setDescription(`Has comprado ${amount}x ${item.name} por 💵${totalPrice}.`)
            .setFooter({ text: 'Economía III' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
}

module.exports = Shop;
