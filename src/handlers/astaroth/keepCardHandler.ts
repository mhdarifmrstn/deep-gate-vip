import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function keepCardHandler(event: NewMessageEvent) {
  const message = event.message;
  const replyMarkup = message.replyMarkup;
  const client = event.client;
  const chatId = event.chatId?.toString();

  if (!client || !chatId) return;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const playerId = client._selfInputPeer?.userId.toString() || "";
    const chat = globalState.registeredChats[chatId];
    const player = globalState.registeredPlayers[playerId];

    try {
      if (chat && player) {
        const rows = getAllButtonsText(replyMarkup);
        debug(`astaroth wants ${player.name} from ${chat.name} to keep their card on a row`);
        await globalState.keepCard.add(chatId, message, rows);
      }
    } catch {}
  }
}

export default keepCardHandler;
