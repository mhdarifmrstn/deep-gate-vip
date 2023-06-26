import { NewMessageEvent } from "telegram/events/index.js";
import sleep from "../../extra/sleep.js";
import globalState from "../../services/globalState.js";
import getRandom from "../../extra/getRandom.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import debug from "../../services/debug.js";
import getCurrentGame from "../../extra/getCurrentGame.js";

async function selectCardHandler(event: NewMessageEvent) {
  const client = event.client;
  const message = event.message;
  const replyMarkup = message.replyMarkup;

  if (!client) return;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const playerId = client._selfInputPeer?.userId.toString() || "";
    const player = globalState.registeredPlayers[playerId];
    const arePlayed = getCurrentGame(playerId);

    if (player && arePlayed) {
      try {
        const cards = getAllButtonsText(replyMarkup);
        const selectedCardText = getRandom(cards);
        const selectedcard = Number(selectedCardText.split(" ")[0]);
        const chatIdTheyArePlayed = arePlayed;
        const chatTheyArePlayed = globalState.registeredChats[chatIdTheyArePlayed];

        if (!chatTheyArePlayed) return;

        await sleep(globalState.selectCardDelay);
        await message.click({ text: selectedCardText });
        debug(`player ${player.name} from ${chatTheyArePlayed.name} choose ${selectedcard}`);

        globalState.selectedCards.add(chatIdTheyArePlayed, selectedcard);
      } catch {}
    }
  }
}

export default selectCardHandler;
