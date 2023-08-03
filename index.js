const { SlashCommandBuilder, Routes, Client, MessageAttachment, GatewayIntentBits, ActivityType} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./auth.json');
const os = require('os');
const fs = require("fs");
const meows = Array("meowww <:pleading_cat:1093607301941829652>", "meow", "# MEOWWWW", "meow :3", "miau", "meeow", "meowwwwwwwww", "meow meow meow <:pleading_cat:1093607301941829652>", "you play like a cat 🐈 mrrp mrp meow", ":3")
const mewos = Array("mewooo <:pleading_cat:1093607301941829652>", "mewo", "# MEWOOOO", "mewo :3", "miua", "meewo", "mewooooooooo", "mewo mewo mewo <:pleading_cat:1093607301941829652>", "you play like a cat 🐈 mrrp mrp mewo", ":3")

var meowmax = Math.floor(Math.random() * (10000 - 2500 + 1) + 2500);
var meowcount = 0

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Bot ready!');
    client.user.setPresence({
	    activities: [{ name: `with a laser pointer`, type: ActivityType.Streaming }],
        status: 'online',
    });
});

// Login to Discord with your client's token
client.login(token);
console.log(`Logged in!`)

const commands = [
    new SlashCommandBuilder().setName('meow').setDescription('🐱'),
    new SlashCommandBuilder().setName('mewo').setDescription('🐱'),
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

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes("meow") || message.content.toLowerCase().includes("<:pleading_cat:1093607301941829652>")) {
        message.react("<:pleading_cat:1093607301941829652>");
    }
    if (meowcount == meowmax) {
        if (meowcount < 5750) {
            message.channel.send(meows[Math.floor(Math.random() * meows.length)]);
        } else {
            message.channel.send(mewos[Math.floor(Math.random() * mewos.length)]);
        }
    }
})

client.on('interactionCreate', async interaction => {
  console.log("Received a command!")
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
        case 'meow':
            await interaction.reply(meows[Math.floor(Math.random() * meows.length)]);
            break;
        case 'mewo':
            await interaction.reply(mewos[Math.floor(Math.random() * mewos.length)]);
            break;
        case 'server':
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nCreated on: ${interaction.guild.createdAt}\nID: ${interaction.guild.id}`);
            break;
        case 'status':
            await interaction.reply(`Bot is **online**\nRunning on ${os.platform()} ${os.release()}, node.js ${process.version}\nWebsocket heartbeat (ping): ${client.ws.ping}ms.`);
            break;
        case 'info':
            await interaction.reply(`**MeowBot**\nCreated by BomberFish\nLicensed under the GNU Affero GPL v3. Source code available at https://github.com/BomberFish/MeowBot`);
            break;
    }
});

client.once('reconnecting', () => {
    console.log('Reconnecting...');
 });
 client.once('disconnect', () => {
    console.log('Disconnected!');
 });
