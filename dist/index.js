"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const api_1 = require("./api");
const client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ] });
client.once(discord_js_1.Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on(discord_js_1.Events.MessageCreate, async (message) => {
    let responseReturned = false;
    if (message.author.bot)
        return;
    // typing indicator
    await message.channel.sendTyping();
    // Get last 3 messages
    const messages = await message.channel.messages.fetch({ limit: 3 });
    function sendTypingIndivator() {
        setTimeout(() => {
            // If response is not returned, send typing indicator again
            if (!responseReturned)
                message.channel.sendTyping();
            sendTypingIndivator();
        }, 10500);
    }
    sendTypingIndivator();
    const data = messages.reduce((acc, msg) => {
        acc.unshift({
            role: msg.author.bot ? 'assistant' : 'user',
            content: msg.content,
        });
        return acc;
    }, []);
    const response = await (0, api_1.makeRequest)(data);
    responseReturned = true;
    // trim response.content to 2000 characters or less
    if (response.content.length > 2000) {
        response.content = response.content.slice(0, 2000);
    }
    message.channel.send(response.content);
});
client.login(config_1.DISCORD_API_KEY);
