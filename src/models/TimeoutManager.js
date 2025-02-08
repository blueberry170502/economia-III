const fs = require('fs');
const TIMEOUT_FILE = 'data/userTimeouts.json';
const { EmbedBuilder } = require('discord.js');

class TimeoutManager {
    constructor() {
        this.timeouts = this.loadTimeouts();
    }

    loadTimeouts() {
        if (!fs.existsSync(TIMEOUT_FILE)) {
            fs.writeFileSync(TIMEOUT_FILE, JSON.stringify({}, null, 2)); 
        }
        return JSON.parse(fs.readFileSync(TIMEOUT_FILE, 'utf8')); 
    }

    saveTimeouts() {
        fs.writeFileSync(TIMEOUT_FILE, JSON.stringify(this.timeouts, null, 2));
    }

    checkTimeout(message, actionType, timeout) {
        const lastActionTime = this.timeouts[message.author.id];
        const currentTime = Date.now();

        if (lastActionTime && (currentTime - lastActionTime) < timeout) {
            const remainingTime = Math.ceil((timeout - (currentTime - lastActionTime)) / 1000);
            const embed = new EmbedBuilder()
                .setColor('#FF0000') // Color rojo 
                .setTitle('Error')
                .setDescription(`Por favor espera ${remainingTime} segundos antes de realizar otra acción de tipo ${actionType}.`)
                .setFooter({ text: 'Economía III' })
                .setTimestamp();
            message.reply({ embeds: [embed] });
            return false;
        }

        this.timeouts[message.author.id] = currentTime;
        this.saveTimeouts();  

        return true;
    }
}

module.exports = TimeoutManager;
