const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const { version } = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Show server/bot information")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Choose what to display")
        .setRequired(true)
        .addChoices(
          { name: "Bot", value: "bot" },
          { name: "Server", value: "server" }
        )
    ),
  async execute(interaction) {
    const choice = interaction.options.getString("type");
    
    // This check is technically redundant due to .setRequired(true)
    // but provides a fallback in case the validation fails
    if (!choice || !["bot", "server"].includes(choice)) {
      return interaction.reply({
        content: "❌ Invalid command usage. Please specify either `/about bot` or `/about server`.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder().setColor("#C11C1C");

    if (choice === "server") {
      const server = interaction.guild;
      const owner = await server.fetchOwner();

      embed.addFields({
        name: "🖥️ Server Information",
        value: [
          `**Name:** ${server.name}`,
          `**Owner:** ${owner.user.username}`,
          `**Created:** ${formatDate(server.createdAt)}`,
          `**Members:** ${server.memberCount.toLocaleString()}`,
          `**Channels:** ${getChannelCounts(server)}`
        ].join("\n")
      });

      if (server.iconURL()) {
        embed.setThumbnail(server.iconURL({ size: 256 }));
      }
    }

    if (choice === "bot") {
      const bot = interaction.client.user;

      embed.addFields({
        name: "🤖 Bot Information",
        value: [
          `**Name:** ${bot.username}`,
          `**Version:** v${version}`,
          `**Commands:** ${interaction.client.commands.size}`,
          `**Ping:** ${Math.round(interaction.client.ws.ping)}ms`,
          `**Uptime:** ${formatUptime(interaction.client.uptime)}`
        ].join("\n")
      });

      embed.setThumbnail(bot.displayAvatarURL({ size: 256 }));
    }

    embed.setTitle(`ℹ️ About ${choice === "bot" ? "Bot" : "Server"}`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

// Helper functions remain the same
function formatDate(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getChannelCounts(server) {
  const channels = server.channels.cache;
  return [
    `Text: ${channels.filter((c) => c.type === ChannelType.GuildText).size}`,
    `Voice: ${channels.filter((c) => c.type === ChannelType.GuildVoice).size}`,
    `Categories: ${
      channels.filter((c) => c.type === ChannelType.GuildCategory).size
    }`,
  ].join(", ");
}

function formatUptime(ms) {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor(ms / 3600000) % 24;
  return `${days}d ${hours}h`;
}