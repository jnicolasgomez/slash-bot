import { SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    Poll} from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('rehearsal')
    .setDescription('Generar encuesta de ensayo')
    .addStringOption(option =>
        option.setName('date')
          .setDescription('Fecha del ensayo')
          .setRequired(true));

export async function execute(client, interaction) {
    const date = interaction.options.getString('date');
    const answers = ["10:00am", "11:00am", "2:00pm", "4:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm","No puedo"];
    const pollDuration = 96; // 5 days in milliseconds
    //const poll = new Poll()
      //  .setQuestion(`@everyone Ensayo para el próximo ${dates}`);
        //.setAnswers(options.map(option => ({ text: option })))


      const message = await interaction.reply({poll: {
        question: {text: `Ensayo para el próximo ${date} 🗓️`},
        answers: answers.map(answer => ({text: answer})),
        allowMultiselect: true,
        duration: pollDuration},
        content: `@everyone :guitar: :drum:`,
    });


    // Listen for the poll end event
    client.on('pollEnd', async (poll) => {
    });
    client.on('message', async (message) => {
      //console.log(message)
    });
}
export default {
    data: data,
    execute: execute
};
// This is a simple ping command for a Discord bot using discord.js.