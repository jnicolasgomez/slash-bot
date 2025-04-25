import { SlashCommandBuilder,
    EmbedBuilder,
    REST,
    Routes} from "discord.js";


export const data = new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('poll reminder')
    .addStringOption(options =>
        options.setName('poll-message-id')
            .setDescription('ID del mensaje de la encuesta')
            .setRequired(true));

export async function execute(client, interaction) {
    // fetch poll message and send a reminder mentioning users that haven't voted
    const pollMessageId = interaction.options.getString('poll-message-id');
    const pollMessage = await interaction.channel.messages.fetch(pollMessageId);
    console.log(pollMessage);
    //console.log(getPollVoters(pollMessage.channelId, pollMessage.id, pollMessage.poll.answers[0].id));
    const nonVoters = await getNonVoters(client, pollMessage);
    const pollDuration = pollMessage.poll.expiresTimestamp;
    const pollEndDate = new Date(pollDuration);
    const currentDate = new Date();
    const timeLeft = pollEndDate - currentDate;
    const timeLeftInHours = Math.floor(timeLeft / (1000 * 60 * 60));
    const timeLeftInMinutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const timeLeftInSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const timeLeftString = `${timeLeftInHours}h ${timeLeftInMinutes}m ${timeLeftInSeconds}s`;
    const reminderEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Recordatorio')
        .setDescription(`${nonVoters} faltan por votar, encuesta termina en ${timeLeftString}`)
        .setTimestamp()
        .setFooter({ text: 'Poll Reminder' });
    await interaction.reply({ embeds: [reminderEmbed] });

    // Send a message to the channel
    // await interaction.reply(`@everyone ${interaction.user} ha recordado que la encuesta de ensayo termina en ${timeLeftString}`);
    
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function getPollVoters(pollMessage) {
    const votersPormises = pollMessage.poll.answers.map(answer => {
        return getAnswerVoters(pollMessage.channelId, pollMessage.id, answer.id);
    });
    const voters = await Promise.all(votersPormises);

    const uniqueVoters = voters.flat().filter(function({id}) {
        return !this.has(id) && this.add(id);
      }, new Set);
    
    return uniqueVoters;
}

async function getAnswerVoters(channelId, messageId, answerId) {
    try {
        const voters = await rest.get(Routes.pollAnswerVoters(channelId, messageId, answerId));
        return voters.users;
    } catch (error) {
        console.error('Error getting poll voters:', error);
    }
}

// Function to get all users in a channel
async function getAllUsersInChannel(client, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        // if (!channel || !channel.isText()) {
        //     throw new Error('Invalid channel ID or channel is not a text channel');
        // }
        // channel.members.forEach(member => {
        //     console.log(`${member.user.tag} (ID: ${member.id})`);
        //     // You can access other properties of the GuildMember object here,
        //     // such as their nickname in the server (member.nickname), their roles (member.roles), etc.
        //   });

        // filter out bots and this id 1349783227509903561
        const filteredMembers = channel.members.filter(member => !member.user.bot // &&  member.id !== '1349783227509903561'
        );
        return filteredMembers.map(member => member.user);
    } catch (error) {
        console.error('Error getting all users in channel:', error);
    }
}

//fucntion to get all users in the server
async function getAllUsersInServer(client, guildId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const members = await guild.members.fetch();
        //filter out bots and this id 1349783227509903561
        const filteredMembers = members.filter(member => !member.user.bot &&  member.id !== '1349783227509903561');
        return filteredMembers.map(member => member.user);
    } catch (error) {
        console.error('Error getting all users in server:', error);
    }
}


async function getNonVoters(client, pollMessage) {
    try {
        const allUsers = await getAllUsersInServer(client, pollMessage.guildId);
        const voters = await getPollVoters(pollMessage);
        // console.log(voters)
        //filter non voters by id
        const votersIds = voters.map(voter => voter.id);
        // console.log(votersIds)  
        const nonVoters = allUsers.filter(user => !votersIds.includes(user.id));
        return nonVoters;
    } catch (error) {
        console.error('Error getting non-voters:', error);
    }
}

export default {
    data: data,
    execute: execute
};
// This is a simple ping command for a Discord bot using discord.js.