const Discord = require("discord.js")
const dc = require("discord.js")

module.exports = {
    name: "verificação", // Coloque o nome do comando
    description: "Ganhe cargos clicando nos botões.", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "cargo",
            description: "Mencione o cargo que deseja ser adicionado no botão.",
            type: Discord.ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        } else {
            let cargo = interaction.options.getRole("cargo");

            let embed = new Discord.EmbedBuilder()
                .setColor("Blue")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle("Seja bem-vindo(a) à Hashiriya's!")
                .setDescription(`> No nosso servidor você encontrará os melhores P1 da city!\n> \n> *Clique no botão abaixo para receber o cargo de* **${cargo.name}**!`)
                .setThumbnail("https://cdn.discordapp.com/attachments/1207549395801735198/1243417371574534164/image.png?ex=67f351aa&is=67f2002a&hm=8a006611d11dea4a65fdb3319ba24c24db5be26c6e433cd4ab44ce7ac5ee3522&")
                .setImage("https://cdn.discordapp.com/emojis/1157097516123312168.gif?size=96&quality=lossless")
                .setFooter({
                    iconURL: "https://cdn.discordapp.com/emojis/1255995897326604369.webp?size=96&animated=true",
                    text: (`© Todos os direitos a breno`)
                })


            let botao = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("cargo_b" + interaction.id)
                    .setLabel("Clique Aqui!")
                    .setStyle(Discord.ButtonStyle.Success)
            );

            interaction.channel.send({ embeds: [embed], components: [botao] }).then((msg) => {
                const filter = (i) => i.customId === "cargo_b" + interaction.id;
                const coletor = msg.createMessageComponentCollector({ filter, time: 60000 });

                coletor.on("collect", (c) => {
                    if (!c.member.roles.cache.get(cargo.id)) {
                        c.member.roles.add(cargo.id)
                        c.reply({ content: `Olá **${c.user.username}**, você recebeu o cargo **${cargo.name}**.`, ephemeral: true })
                    } else {
                        c.member.roles.remove(cargo.id)
                        c.reply({ content: `Olá **${c.user.username}**, você perdeu o cargo **${cargo.name}**.`, ephemeral: true })
                    }
                });

                coletor.on("end", () => {
                    botao.components[0].setDisabled(true);
                    msg.edit({ components: [botao] });
                });
            }).catch(console.error);
            
            interaction.reply({ content: `Mensagem para o usuário iniciar a verificação enviada com sucesso.`, ephemeral: true })
        }
    }
}