import { Client, Events, GatewayIntentBits, Partials  } from 'discord.js';
import { DISCORD_API_KEY } from "./config";
import { Message, makeRequest } from './api';
import { CalendarEvents } from './types';

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent,
], partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const superteamEvents: CalendarEvents = {
  events: "",
  lastUpdated: new Date(),
};

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.partial) return;
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

  let response;

  try {
    response = await makeRequest(data);
    responseReturned = true;
  } catch (e) {
    console.error(e);
    responseReturned = true;
    message.reply('Something went wrong, please contact: Kunal Bagaria#0001');
  }

  // trim response.content to 2000 characters or less
  if (response.content.length > 2000) {
    response.content = response.content.slice(0, 2000);
  }
  message.reply(response.content);
});

client.login(DISCORD_API_KEY);