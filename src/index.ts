import { Client, Events, GatewayIntentBits } from 'discord.js';
import { DISCORD_API_KEY } from "./config";

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent,
]});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.content === 'ping') {
    await message.reply('Pong!');
  }
});

client.login(DISCORD_API_KEY);