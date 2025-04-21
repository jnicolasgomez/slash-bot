import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import { createServer } from 'http';

dotenv.config();
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
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

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}
)().catch((error) => {
    console.error('Error connecting to MongoDB:', error);
}
);

// Start express server
const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

server.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});

