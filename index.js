const { SlashCommandBuilder, Routes, Client, MessageAttachment, GatewayIntentBits} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./auth.json');
const os = require('os');
const fs = require("fs");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Bot ready!');
    // why doesnt this work ;(
  client.user.setPresence({
    game: {
     name: 'with the discord.js library',
     type: 'PLAYING',
    },
    status: 'online',
   });
});

// Login to Discord with your client's token
client.login(token);
console.log(`Logged in!`)

const commands = [
    new SlashCommandBuilder().setName('meow').setDescription('🐱'),
    new SlashCommandBuilder().setName('server').setDescription('Details of current server'),
    new SlashCommandBuilder().setName('status').setDescription('Bot status'),
    new SlashCommandBuilder().setName('info').setDescription('Bot info'),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);
console.log("Registering slash commands...")
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered slash commands!'))
    .catch(console.error);

client.on('interactionCreate', async interaction => {
  console.log("Received a command!")
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'meow') {
        await interaction.reply('meowww 🥺🐱');
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nCreated on: ${interaction.guild.createdAt}\nID: ${interaction.guild.id}`);
    } else if (commandName === 'status') {
        await interaction.reply(`Bot is **online**\nRunning on ${os.platform()} ${os.release()}, node.js ${process.version}\nWebsocket heartbeat (ping): ${client.ws.ping}ms.\n`    );
    } else if (commandName === 'info') {
        await interaction.reply(`**MeowBot**\nCreated by BomberFish\nLicensed under the GNU Affero GPL v3. Source code available at https://github.com/BomberFish/MeowBot`);
    } 
});

client.once('reconnecting', () => {
    console.log('Reconnecting...');
 });
 client.once('disconnect', () => {
    console.log('Disconnected!');
 });