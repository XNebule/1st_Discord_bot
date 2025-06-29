const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Access the patient command manual"),

  async execute(interaction) {
    try {
      // Fetch admin and mod roles
      const adminRole = await interaction.guild.roles.fetch(
        "1384043302143262743"
      );
      const modRole = await interaction.guild.roles.fetch(
        "1383844910524006420"
      );

      // Proper mention formatting
      const adminText = adminRole ? `<@&${adminRole.id}>` : "Administrator";
      const modText = modRole ? `<@&${modRole.id}>` : "Moderator";

      // Sort and format commands
      const commands = [...interaction.client.commands.values()]
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map((cmd) => `• **/${cmd.data.name}** — ${cmd.data.description}`)
        .join("\n");

      // Build the embed
      const embed = new EmbedBuilder()
        .setColor("#C11C1C")
        .setTitle("📖 Dr. Michael Myers' Command Manual")
        .setDescription(
          `Welcome to the observation chamber.\n\n` +
            `Each command below is a tool — for control, surveillance, or behavioral correction.\nUse them wisely.\n\n` +
            `${commands}\n\n` +
            `_For assistance, contact ${modText}_\n_Feedback & escalation to ${adminText}_`
        )
        .setFooter({
          text: `Patient Command Manual — v1.0`,
          iconURL: interaction.client.user.displayAvatarURL(),
        });

      // Reply with embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Help command error:", error);
      await interaction.reply({
        content:
          "⚠️ Failed to generate help menu. Dr. Myers will investigate the issue shortly.",
        ephemeral: true,
      });
    }
  },
};
