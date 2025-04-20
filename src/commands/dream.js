import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('dream')
    .setDescription('Comparte un nuevo sueño!');

export async function execute(client, interaction) {
    const modal = new ModalBuilder()
        .setCustomId('dreamModal')
        .setTitle('Comparte tu sueño');

    const dreamInput = new TextInputBuilder()
        .setCustomId('dreamInput')
        .setLabel("Título")
        .setPlaceholder("Cual es el título de tu sueño?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
    
    const dreamArtistInput = new TextInputBuilder()
        .setCustomId('dreamArtistInput')
        .setLabel("Artista")
        .setPlaceholder("Especifica si es artista original o Cover")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

    const dreamUrlInput = new TextInputBuilder()
        .setCustomId('dreamUrlInput')
        .setLabel("URL")
        .setPlaceholder("Pegar URL de Spotify o Youtube")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
    

    const row = new ActionRowBuilder().addComponents(dreamInput);
    const row2 = new ActionRowBuilder().addComponents(dreamArtistInput);
    const row3 = new ActionRowBuilder().addComponents(dreamUrlInput);
    modal.addComponents(row, row2, row3);
    // Show the modal to the user

    await interaction.showModal(modal);

    // Listen for the modal submit event
    client.on('interactionCreate', async (modalInteraction) => {
        if (!modalInteraction.isModalSubmit()) return;
        if (modalInteraction.customId === 'dreamModal') {
            const dreamTitle = modalInteraction.fields.getTextInputValue('dreamInput');
            const dreamArtist = modalInteraction.fields.getTextInputValue('dreamArtistInput');
            const dreamUrl = modalInteraction.fields.getTextInputValue('dreamUrlInput');

            // Send information to mongodb using mongoose

            // Send a message to the channel

            await modalInteraction.reply(`${modalInteraction.user} ha compartido un nuevo sueño!\n **Título:** ${dreamTitle}\n**Artista:** ${dreamArtist}\n**URL:** ${dreamUrl}`);
        }
    });
}
export default {
    data: data,
    execute: execute
};
// This is a simple ping command for a Discord bot using discord.js.