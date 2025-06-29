const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all available commands in alphabetical order"),
  async execute(interaction) {
    const commands = [...interaction.client.commands.values()]
      .sort((a, b) => a.data.name.localeCompare(b.data.name))
      .map((cmd) => `**/${cmd.data.name}** - ${cmd.data.description}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#57F287")
      .setTitle("📚 Command Help")
      .setDescription(`Use \`/command-name\` to interact\n\n${commands}`)
      .setFooter({
        text: `Total ${interaction.client.commands.size} commands`,
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
