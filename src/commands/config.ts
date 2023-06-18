import { NewMessageEvent } from "telegram/events/index.js";
import bot from "../botAccount.js";
import { Button } from "telegram/tl/custom/button.js";
import globalState from "../services/globalState.js";

async function configHandler(event: NewMessageEvent) {
  const chatId = event.chatId?.toString();
  const configList = [["Jumlah Pemain", "totalPlayer"]];
  const x = globalState.callbackQuerySeparator;

  if (!chatId) return;

  await bot.sendMessage(chatId, {
    message: "List config gc Dark Fears Privat\nKlik pada salah satu pilihan!",
    buttons: bot.buildReplyMarkup(
      configList.map((config) => {
        const configName = config[0];
        const configData = config[1];

        return [Button.inline(configName, Buffer.from(`config${x}select${x}${configData}`))];
      })
    ),
  });
}

export default configHandler;
