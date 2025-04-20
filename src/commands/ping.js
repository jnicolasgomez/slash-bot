import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');
export async function execute(client, interaction) {
    await interaction.reply(`**Pong!** Latencia es de **${client.ws.ping} ms**.`);
}
export default {
    data: data,
    execute: execute
};
// This is a simple ping command for a Discord bot using discord.js.