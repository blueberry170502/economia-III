const { EmbedBuilder } = require('discord.js');

function errorEmbed(message) {
    return new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Error')
        .setDescription(message)
        .setFooter({ text: 'Economía III' })
        .setTimestamp();
}

function createEmbed(title, message, color = '#00ff00') {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(message)
        .setFooter({ text: 'Economía III' })
        .setTimestamp();
}

module.exports = { createEmbed, errorEmbed };