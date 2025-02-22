const fs = require('fs');
const DATA_FILE = 'data/economy.json';
const TimeoutManager = require('./TimeoutManager');
const DatabaseManager = require('./DatabaseManager');
const { createEmbed, errorEmbed } = require('../utils/utils');

const timeoutManager = new TimeoutManager();

class User {
    constructor(id) {
        this.id = id;
        this.db = new DatabaseManager('data/economy.json');
        this.data = this.db.getUserData(id);
    }

    save() {
        this.db.data[this.id] = this.data;
        this.db.saveData();
    }

    checkTimeout(userId, actionType, timeout, message) {
        return timeoutManager.checkTimeout(userId, actionType, timeout, message);
    }

    work(message) {
        if (!this.checkTimeout(this.id, 'trabajo', 15000, message)) return;

        const earnings = Math.floor(Math.random() * 100) + 50;
        this.data.wallet += earnings;
        this.save();

        const embed = createEmbed('¡Trabajo completado!', `${message.author.username} ha trabajado y ganado 💵${earnings}.`);
        embed.setThumbnail(message.author.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }

    rob(message, args) {
        if (!this.checkTimeout(this.id, 'robo', 30000, message)) return;
        
        const targetUser = message.mentions.users.first();
        if (!targetUser || targetUser.id === this.id) {
            return message.reply({ embeds: [errorEmbed('Debes mencionar a un usuario válido para robar.')] });
        }
        
        let economy = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const targetData = economy[targetUser.id] || { wallet: 0, bank: 0 };
        if (targetData.wallet <= 0) {
            return message.reply({ embeds: [errorEmbed('Este usuario no tiene dinero en la cartera.')] });
        }
        
        const stealAmount = Math.floor(targetData.wallet * (Math.random() * 0.45 + 0.05));
        targetData.wallet -= stealAmount;
        this.data.wallet += stealAmount;
        
        economy[targetUser.id] = targetData;
        economy[this.id] = this.data;
        fs.writeFileSync(DATA_FILE, JSON.stringify(economy, null, 2));
        
        const embed = createEmbed('¡Robo exitoso!', `${message.author.username} ha robado 💵${stealAmount} de ${targetUser.username}.`);
        embed.setThumbnail(message.author.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }

    deposit(message, amount) {
        if (!amount) {
            return message.reply({ embeds: [errorEmbed("Debes especificar una cantidad o usar 'all'.")] });
        }
    
        if (amount.toLowerCase() === 'all') amount = this.data.wallet;
        amount = parseInt(amount, 10);
    
        if (isNaN(amount) || amount <= 0 || amount > this.data.wallet) {
            return message.reply({ embeds: [errorEmbed("Cantidad inválida o insuficiente en la cartera.")] });
        }
    
        this.data.wallet -= amount;
        this.data.bank += amount;
        this.save();
    
        const embed = createEmbed('Depósito realizado', `${message.author.username} ha depositado 💵${amount} en el banco.`);
        embed.setThumbnail(message.author.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }
    

    withdraw(message, amount) {
        if (!amount) {
            return message.reply({ embeds: [errorEmbed("Debes especificar una cantidad o usar 'all'.")] });
        }
    
        if (amount.toLowerCase() === 'all') amount = this.data.bank; // Asegurar comparación correcta
        amount = parseInt(amount, 10);
    
        if (isNaN(amount) || amount <= 0 || amount > this.data.bank) {
            return message.reply({ embeds: [errorEmbed("Cantidad inválida o insuficiente en el banco.")] });
        }
    
        this.data.bank -= amount;
        this.data.wallet += amount;
        this.save();
    
        const embed = createEmbed('Retiro realizado', `${message.author.username} ha retirado 💵${amount} del banco.`);
        embed.setThumbnail(message.author.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }
    

    balance(message) {
        const user = message.author;
        const targetUser = message.mentions.users.first();

        const embed = createEmbed(
            `Balance de ${targetUser ? targetUser.username : user.username}`,
            `💰 Cartera: $${this.data.wallet}\n\n🏦 Banco: $${this.data.bank}\n\n💵 Total: $${this.data.wallet + this.data.bank}`, '#0077ff'
        );
        embed.setThumbnail(targetUser ? targetUser.displayAvatarURL() : user.displayAvatarURL());

        message.reply({ embeds: [embed] });
    }
}

module.exports = User;
