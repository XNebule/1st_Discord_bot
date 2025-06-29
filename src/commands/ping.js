const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),
  async execute(interaction) {
    // Send initial response
    await interaction.reply({
        content: 'tests',
        ephemeral: true
    });

    // Get the response message
    const response = await interaction.fetchReply();

    // Calculate latency
    const latency = response.createdTimestamp - interaction.createdTimestamp;

    // Edit the original response
    await interaction.editReply(`🏓 Pong! Latency: ${latency}ms`);
  },
};