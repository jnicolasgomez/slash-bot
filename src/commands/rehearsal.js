import { SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder,
    Poll} from "discord.js";

import {createRehearsalPoll} from "../utils/rehearsalPoll.js";

export const data = new SlashCommandBuilder()
    .setName('rehearsal')
    .setDescription('Generar encuesta de ensayo')
    .addStringOption(option =>
        option.setName('date')
          .setDescription('Fecha del ensayo')
          .setRequired(true));

export async function execute(client, interaction) {
  const date = interaction.options.getString('date');

  const poll  = createRehearsalPoll(date);
  await interaction.reply(poll);


}
export default {
    data: data,
    execute: execute
};
// This is a simple ping command for a Discord bot using discord.js.