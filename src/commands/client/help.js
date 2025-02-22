const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Muestra la lista de comandos disponibles',
    execute(message, args, { client }) {
        const embed = new EmbedBuilder()
            .setColor('#0077ff')
            .setTitle('Lista de Comandos')
            .setDescription('Aquí están los comandos disponibles:')
            .setFooter({ text: 'Economía III' })
            .setTimestamp();

        client.commands.forEach(command => {
            embed.addFields({ name: `!${command.name}`, value: command.description, inline: false });
        });

        message.reply({ embeds: [embed] });
    }
};
