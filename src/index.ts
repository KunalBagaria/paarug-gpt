import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  TextChannel,
  Message as MessageInterface,
  ChannelType,
} from "discord.js";
import { getLatestEvents } from "./events";
import { DISCORD_API_KEY } from "./config";
import { Message, makeRequest } from "./api";
import { CalendarEvents } from "./types";
import { getButtons } from "./buttons";
import { createFeedback } from "./feedback";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const superteamEvents: CalendarEvents = {
  events: "",
  lastUpdated: new Date(),
};

async function getEvents() {
  // get events if last updated is more than 12 hours ago
  if (
    new Date().getTime() - superteamEvents.lastUpdated.getTime() >
      12 * 60 * 60 * 1000 ||
    superteamEvents.events === ""
  ) {
    const latestEvents = await getLatestEvents();
    if (latestEvents instanceof Error) {
      console.error(latestEvents);
      return "Error while fetching events";
    }
    superteamEvents.events = latestEvents.events;
    superteamEvents.lastUpdated = latestEvents.lastUpdated;
    return latestEvents.events;
  } else {
    return superteamEvents.events;
  }
}

async function handleMessage(message: MessageInterface) {
  let responseReturned = false;

  if (message.author.bot) return;

  // typing indicator
  await message.channel.sendTyping();

  // Get latest events
  const calendarEvents = await getEvents();

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
      role: msg.author.bot ? "assistant" : "user",
      content: msg.content,
    });
    return acc;
  }, []);

  let response;

  try {
    response = await makeRequest(data, calendarEvents);
    responseReturned = true;
  } catch (e) {
    console.error(e);
    responseReturned = true;
    message.reply("Something went wrong, please contact: @kunalbagaria");
  }
  // trim response.content to 2000 characters or less
  if (response.content.length > 2000) {
    response.content = response.content.slice(0, 2000);
  }
  const row = getButtons();

  message.reply({
    content: response.content,
    components: [row as any],
  });
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.partial) return;
  // only respond in DMs
  if (message.channel.type !== ChannelType.DM) return;
  await handleMessage(message);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;
    const user = interaction.user;
    // Handle the button click
    if (interaction.customId === "good") {
      await interaction.reply({
        content: "Thanks for your feedback!",
        ephemeral: true,
      });
      await createFeedback(true);
    } else if (interaction.customId === "bad") {
      await interaction.reply({
        content: "Thanks for your feedback, we will work on improving.",
        ephemeral: true,
      });
      await createFeedback(false);
      const channel = (await client.channels.fetch(
        "1117781242843246593"
      )) as TextChannel;
      await channel.send({
        content: `Bad response to user: (${user.tag})'s prompt: \n${
          "```" + interaction.message.content + "```"
        }`,
      });
    }
  } catch (e) {
    console.error(e);
  }
});

client.login(DISCORD_API_KEY);