const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const TIMEOUT_FILE = 'data/userTimeouts.json';

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

    checkTimeout(userId, command, timeout, message) {
        if (!this.timeouts[userId]) {
            this.timeouts[userId] = {};
        }
        const now = Date.now();

        if (this.timeouts[userId][command] && now - this.timeouts[userId][command] < timeout) {
            const remainingTime = Math.ceil((timeout - (now - this.timeouts[userId][command])) / 1000);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Espera un momento')
                .setDescription(`Debes esperar ${remainingTime} segundos antes de usar **${command}** de nuevo.`)
                .setFooter({ text: 'Economía III' })
                .setTimestamp();
            message.reply({ embeds: [embed] });
            return false;
        }

        this.timeouts[userId][command] = now;
        this.saveTimeouts();
        return true;
    }
}

module.exports = TimeoutManager;
