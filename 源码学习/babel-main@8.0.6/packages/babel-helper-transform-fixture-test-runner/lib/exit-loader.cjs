process.on("message", () => process.exit(0));
process.channel?.unref();