import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function keepCardHandler(event: NewMessageEvent) {
  const message = event.message;
  const replyMarkup = message.replyMarkup;
  const client = event.client;

  if (!client) return;

  const registeredChats = globalState.registeredChats;
  const registeredChatIds = Object.keys(registeredChats);
  const playerId = client._selfInputPeer?.userId.toString() || "";

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    registeredChatIds.forEach(async (chatId) => {
      const registeredChat = registeredChats[chatId];
      const player = registeredChat?.players[playerId];

      try {
        if (player) {
          const rows = getAllButtonsText(replyMarkup);
          debug(`astaroth wants ${player.name} from ${registeredChat.name} to keep their card on a row`);
          await globalState.keepCard.add(chatId, message, rows);
        }
      } catch {}
    });
  }
}

export default keepCardHandler;
