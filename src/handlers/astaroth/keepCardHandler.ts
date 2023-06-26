import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";
import getCurrentGame from "../../extra/getCurrentGame.js";

async function keepCardHandler(event: NewMessageEvent) {
  const message = event.message;
  const replyMarkup = message.replyMarkup;
  const client = event.client;

  if (!client) return;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const playerId = client._selfInputPeer?.userId.toString() || "";
    const player = globalState.registeredPlayers[playerId];
    const arePlayed = getCurrentGame(playerId);

    if (player && arePlayed) {
      try {
        const chatIdTheyArePlayed = arePlayed;
        const chatTheyArePlayed = globalState.registeredChats[chatIdTheyArePlayed];
        const rows = getAllButtonsText(replyMarkup);

        if (!chatTheyArePlayed) return;

        debug(`astaroth wants ${player.name} from ${chatTheyArePlayed.name} to keep their card on a row`);
        await globalState.keepCard.add(chatIdTheyArePlayed, message, rows);
      } catch {}
    }
  }
}

export default keepCardHandler;
