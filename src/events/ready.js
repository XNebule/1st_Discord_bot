module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`✅ ${client.user.tag} is online`);

    // Register commands for specific guild (instant update)
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return console.error("❌ Guild not found");

    try {
      await guild.commands.set(
        [...client.commands.values()].map((cmd) => cmd.data)
      );
      console.log(`✅ Commands registered for: ${guild.name}`);
    } catch (error) {
      console.error("❌ Command registration failed:", error);
    }
  },
};
