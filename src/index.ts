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
  let responseReturned = false;

  if (message.author.bot) return;

  // typing indicator
  await message.channel.sendTyping();

  // Get last 3 messages
  const messages = await message.channel.messages.fetch({ limit: 3 });

  function sendTypingIndivator() {
    setTimeout(() => {
      // If response is not returned, send typing indicator again
      if (!responseReturned) message.channel.sendTyping();
      sendTypingIndivator();
    }, 10500);
  }

  sendTypingIndivator();

  const data = messages.reduce<Message[]>((acc, msg) => {
    acc.unshift({
      role: msg.author.bot ? 'assistant' : 'user',
      content: msg.content,
    });
    return acc;
  }, []);

  const response = await makeRequest(data);
  responseReturned = true;

  // trim response.content to 2000 characters or less
  if (response.content.length > 2000) {
    response.content = response.content.slice(0, 2000);
  }
  message.channel.send(response.content);
});

client.login(DISCORD_API_KEY);