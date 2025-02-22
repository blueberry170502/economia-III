const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'add',
    description: 'Añadir dinero, objetos o roles a un usuario',
    execute(message, args, { moderador }) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Permiso denegado')
                        .setDescription('No tienes permiso para usar este comando.')
                        .setFooter({ text: 'Moderación' })
                        .setTimestamp()
                ]
            });
        }
        
        if (!args[0]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Error')
                        .setDescription('Debes especificar un tipo de acción: `money` o `item`.')
                        .setFooter({ text: 'Moderación' })
                        .setTimestamp()
                ]
            });
        }
        
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Error')
                        .setDescription('Debes mencionar a un usuario.')
                        .setFooter({ text: 'Moderación' })
                        .setTimestamp()
                ]
            });
        }
        
        const amount = parseInt(args[2], 10);
        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Error')
                        .setDescription('La cantidad debe ser un número válido y mayor que 0.')
                        .setFooter({ text: 'Moderación' })
                        .setTimestamp()
                ]
            });
        }
        
        switch (args[0]) {
            case 'money': {
                const type = args[1];
                if (!['wallet', 'bank'].includes(type)) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('#FF0000')
                                .setTitle('Error')
                                .setDescription('Debes especificar `wallet` o `bank` como tipo de dinero.')
                                .setFooter({ text: 'Moderación' })
                                .setTimestamp()
                        ]
                    });
                }
                moderador.addMoneyToUser(targetUser.id, amount, type);
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle('Dinero añadido')
                            .setDescription(`Se han añadido 💵 ${amount} al **${type}** de ${targetUser.username}.`)
                            .setFooter({ text: 'Moderación' })
                            .setTimestamp()
                    ]
                });
            }
            case 'item': {
                const itemId = args[1];
                if (!itemId) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('#FF0000')
                                .setTitle('Error')
                                .setDescription('Debes especificar el ID del objeto.')
                                .setFooter({ text: 'Moderación' })
                                .setTimestamp()
                        ]
                    });
                }
                moderador.addItemToUser(targetUser.id, itemId, amount);
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle('Objeto añadido')
                            .setDescription(`Se han añadido ${amount}x del objeto **${itemId}** a ${targetUser.username}.`)
                            .setFooter({ text: 'Moderación' })
                            .setTimestamp()
                    ]
                });
            }
            default:
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle('Error')
                            .setDescription('Tipo de acción no válido. Usa `money` o `item`.')
                            .setFooter({ text: 'Moderación' })
                            .setTimestamp()
                    ]
                });
        }
    }
};
