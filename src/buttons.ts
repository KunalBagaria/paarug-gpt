import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

function getButtons() {
  const good = new ButtonBuilder()
    .setCustomId("good")
    .setLabel("Good Response")
    .setStyle(ButtonStyle.Primary)
    .setEmoji('👍');
  const bad = new ButtonBuilder()
    .setCustomId("bad")
    .setLabel("Bad Response")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('👎');
  const row = new ActionRowBuilder().addComponents(good, bad);
  return row;
}

function getDMButton() {
  const dm = new ButtonBuilder()
    .setLabel("DM the real Paarug")
    .setStyle(ButtonStyle.Link)
    .setURL("https://twitter.com/paarugsethi")
  const row = new ActionRowBuilder().addComponents(dm);
  return row;
}

export { getButtons, getDMButton };