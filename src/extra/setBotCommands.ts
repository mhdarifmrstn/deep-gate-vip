import { Api, TelegramClient } from "telegram";

async function setBotCommands(bot: TelegramClient) {
  await bot.invoke(
    new Api.bots.SetBotCommands({
      scope: new Api.BotCommandScopeDefault(),
      langCode: "en",
      commands: [
        new Api.BotCommand({
          command: "config",
          description: "Pengaturan",
        }),
        new Api.BotCommand({
          command: "uptime",
          description: "Lihat sudah berapa lama botnya jalan",
        }),
      ],
    })
  );
}

export default setBotCommands;
