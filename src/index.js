import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { createRehearsalPoll } from './utils/rehearsalPoll.js';
// import express from 'express';
// import { createServer } from 'http';

dotenv.config();
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction
    ]
});

client.slashCommands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    console.log(`Slash commands - ${file} Loaded`);
    client.slashCommands.set(command.data.name, command);
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    cron.schedule('0 10 * * 1', async () => {
        console.log(`Running the scheduled task on date ${new Date()}!`);
        const nextSundayDate = getNextSundayDateString();
        const commandName = "rehearsal";
        const rehearsalCommand = client.slashCommands.find(cmd => cmd.data.name == commandName);
        if (rehearsalCommand) {
          const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID); // Replace with your server ID
          if (guild) {
            const channel = guild.channels.cache.find(ch => ch.name === 'general'); // Replace with your target channel name or ID
            const poll = createRehearsalPoll(nextSundayDate);
            await channel.send( poll); // Or any other relevant content
            
            console.log("Sent message to channel:", channel.name);

          } else {
            console.log('Guild not found.');
          }
        } else {
          console.log(`Command "${commandName}" not found.`);
        }
      }, {
        scheduled: true,
        timezone: 'America/Bogota' // Specify the Bogotá timezone
      });
    });

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const commands = client.slashCommands.get(interaction.commandName);
        if (!commands) return;
        try {
            await commands.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Logged in successfully');
    })
    .catch((error) => {
        console.error('Error logging in:', error);
    });

// (async () => {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');
// }
// )().catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
// }
// );

function getNextSundayDateString() {
    const now = new Date('2025-04-28T11:38:00-05:00'); // Starting from the current date and time in Bogotá
    const dayOfWeek = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const daysUntilSunday = (7 - dayOfWeek) % 7; // Calculate how many days until the next Sunday
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
  
    return nextSunday.toLocaleString('es-CO', { // 'es-CO' for Colombian Spanish
        timeZone: 'America/Bogota',
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });;
  }

// Start express server
// const app = express();
// const server = createServer(app);

// const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.send('Bot is running!');
// });

// server.listen(PORT, () => {
//     console.log(`Express server is running on port ${PORT}`);
// });

