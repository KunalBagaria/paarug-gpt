import { Client, Events, GatewayIntentBits } from 'discord.js';
import { DISCORD_API_KEY } from "./config";
import { Message, makeRequest } from './api';

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
  if (message.author.bot) return;

  // typing indicator
  message.channel.sendTyping();

  // Get last 3 messages
  const messages = await message.channel.messages.fetch({ limit: 3 });

  const data = messages.reduce<Message[]>((acc, msg) => {
    acc.unshift({
      role: msg.author.bot ? 'assistant' : 'user',
      content: msg.content,
    });
    return acc;
  }, []);

  const response = await makeRequest(data);
  message.channel.send(response.content);
});

client.login(DISCORD_API_KEY);