const fs = require('fs');
const DATA_FILE = 'data/economy.json';
const TimeoutManager = require('./TimeoutManager');
const { EmbedBuilder } = require('discord.js');

const timeoutManager = new TimeoutManager();

class User {
    constructor(id) {
        this.id = id;
        this.data = this.loadData();
    }

    loadData() {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify({}));
        }

        const economy = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return economy[this.id] || { wallet: 0, bank: 0 };
    }

    saveData() {
        let economy = {};
        if (fs.existsSync(DATA_FILE)) {
            economy = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
        economy[this.id] = this.data;
        fs.writeFileSync(DATA_FILE, JSON.stringify(economy, null, 2));
    }

    checkTimeout(message, actionType, timeout) {
        return timeoutManager.checkTimeout(message, actionType, timeout);
    }

    work(message) {
        if (!this.checkTimeout(message, 'trabajo', 15000)) return;

        const earnings = Math.floor(Math.random() * 100) + 50;
        this.data.wallet += earnings;
        this.saveData();

        const embed = new EmbedBuilder()
            .setColor('#00ff00')  // Color verde
            .setTitle('¡Trabajo completado!')
            .setDescription(`${message.author.username} has trabajado y ganado 💵${earnings}.`)
            .setThumbnail(message.author.displayAvatarURL()) 
            .setFooter({ text: 'Economía III' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    rob(message, args) {
        if (!this.checkTimeout(message, 'robo', 30000)) return;
        
        const targetUser = message.mentions.users.first();
        if (!targetUser || targetUser.id === this.id) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')  // Color rojo 
                .setTitle('Error')
                .setDescription('Debes mencionar a un usuario válido para robar.')
                .setFooter({ text: 'Economía III' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
        
        let economy = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const targetData = economy[targetUser.id] || { wallet: 0, bank: 0 };
        if (targetData.wallet <= 0) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')  // Color rojo 
                .setTitle('Error')
                .setDescription('Este usuario no tiene dinero en la cartera.')
                .setFooter({ text: 'Economía III' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }
        
        const stealAmount = Math.floor(targetData.wallet * (Math.random() * 0.45 + 0.05));
        targetData.wallet -= stealAmount;
        this.data.wallet += stealAmount;
        
        economy[targetUser.id] = targetData;
        economy[this.id] = this.data;
        fs.writeFileSync(DATA_FILE, JSON.stringify(economy, null, 2));
        
        const embed = new EmbedBuilder()
            .setColor('#ffcc00')  // Color amarillo
            .setTitle('¡Robo exitoso!')
            .setDescription(`${message.author.username} ha robado 💵${stealAmount} de ${targetUser.username}.`)
            .setThumbnail(message.author.displayAvatarURL())  
            .setFooter({ text: 'Economía III' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    deposit(message, args) {
        const amount = args[0] === 'all' ? this.data.wallet : parseInt(args[0], 10);
        if (isNaN(amount) || amount <= 0 || amount > this.data.wallet) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')  // Color rojo para error
                .setTitle('Error')
                .setDescription('Cantidad inválida o insuficiente en la cartera.')
                .setFooter({ text: 'Economía III' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        this.data.wallet -= amount;
        this.data.bank += amount;
        this.saveData();
        
        const embed = new EmbedBuilder()
            .setColor('#0077ff')  // Color azul
            .setTitle('Depósito realizado')
            .setDescription(`${message.author.username} ha depositado 💵${amount} en el banco.`)
            .setThumbnail(message.author.displayAvatarURL()) 
            .setFooter({ text: 'Economía III' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    withdraw(message, args) {
        const amount = args[0] === 'all' ? this.data.bank : parseInt(args[0], 10);
        if (isNaN(amount) || amount <= 0 || amount > this.data.bank) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')  // Color rojo para error
                .setTitle('Error')
                .setDescription('Cantidad inválida o insuficiente en el banco.')
                .setFooter({ text: 'Economía III' })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
        }

        this.data.bank -= amount;
        this.data.wallet += amount;
        this.saveData();

        const embed = new EmbedBuilder()
            .setColor('#ff6600')  // Color naranja
            .setTitle('Retiro realizado')
            .setDescription(`${message.author.username} ha retirado 💵${amount} del banco.`)
            .setThumbnail(message.author.displayAvatarURL())  
            .setFooter({ text: 'Economía III' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    balance(message) {
        const user = message.author;
        const targetUser = message.mentions.users.first();

        const embed = new EmbedBuilder()
            .setColor('#00ff00')  // Color verde
            .setTitle(`Balance de ${targetUser ? targetUser.username : user.username}`) 
            .setThumbnail(targetUser ? targetUser.displayAvatarURL() : user.displayAvatarURL())
            .addFields(
                { name: '💰 Cartera', value: `$${this.data.wallet}`, inline: true },
                { name: '🏦 Banco', value: `$${this.data.bank}`, inline: true },
                { name: '💵 Total', value: `$${this.data.wallet + this.data.bank}`, inline: true }
            )
            .setFooter({ text: 'Economía III' })
            .setTimestamp();  // Agregar un timestamp al embed

        message.reply({ embeds: [embed] });
    }
}

module.exports = User;
