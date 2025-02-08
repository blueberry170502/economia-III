const fs = require('fs');
const TIMEOUT_FILE = 'data/userTimeouts.json';
const { EmbedBuilder } = require('discord.js');

class TimeoutManager {
    constructor() {
        // Cargar los timeouts desde el archivo
        this.timeouts = this.loadTimeouts();
    }

    // Cargar los timeouts desde el archivo JSON
    loadTimeouts() {
        if (fs.existsSync(TIMEOUT_FILE)) {
            return JSON.parse(fs.readFileSync(TIMEOUT_FILE, 'utf8'));
        }
        return {};  // Si el archivo no existe, devolvemos un objeto vacío
    }

    // Guardar los timeouts en el archivo JSON
    saveTimeouts() {
        fs.writeFileSync(TIMEOUT_FILE, JSON.stringify(this.timeouts, null, 2));
    }

    // Verificar si el usuario está dentro del timeout
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

        // Actualizar el tiempo de la última acción
        this.timeouts[message.author.id] = currentTime;
        this.saveTimeouts();  // Guardar los timeouts actualizados

        return true;
    }
}

module.exports = TimeoutManager;
