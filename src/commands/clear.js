const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cls")
    .setDescription("Clear messages (Admin/Mod only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("Number of messages to clear (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Configuration
    const AUTHORIZED_ROLE_IDS = ["1384043302143262743"]; // Your role IDs
    const MAX_MESSAGES = 100;

    // Permission Check (Roles OR ManageMessages)
    const hasRole = interaction.member.roles.cache.some((role) =>
      AUTHORIZED_ROLE_IDS.includes(role.id)
    );
    const hasPermission = interaction.member.permissions.has(
      PermissionFlagsBits.ManageMessages
    );

    if (!hasRole && !hasPermission) {
      return interaction.editReply({
        content:
          "❌ You need either an authorized role or `Manage Messages` permission.",
        ephemeral: true,
      });
    }

    // Execution
    const limit = Math.min(
      interaction.options.getInteger("limit") || MAX_MESSAGES,
      MAX_MESSAGES
    );
    const channel = interaction.channel;

    try {
      // Fetch and delete
      const messages = await channel.messages.fetch({ limit });
      const deletedCount = messages.size;

      await channel.bulkDelete(messages, true);

      // Success response
      await interaction.editReply({
        content: `✅ Cleared ${deletedCount} messages`,
        ephemeral: true,
      });

      // Audit logging
      console.log(
        `[CLEAR] ${interaction.user.tag} (${interaction.user.id}) cleared ${deletedCount} messages in #${channel.name}`
      );
    } catch (error) {
      console.error("[CLEAR ERROR]", error);
      await interaction.editReply({
        content: "❌ Failed to clear messages (maybe older than 14 days?)",
        ephemeral: true,
      });
    }
  },
};
