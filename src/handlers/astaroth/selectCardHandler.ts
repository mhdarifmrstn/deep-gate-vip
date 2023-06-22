import { NewMessageEvent } from "telegram/events/index.js";
import sleep from "../../extra/sleep.js";
import globalState from "../../services/globalState.js";
import getRandom from "../../extra/getRandom.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import debug from "../../services/debug.js";

async function selectCardHandler(event: NewMessageEvent) {
  const client = event.client;
  const message = event.message;
  const replyMarkup = message.replyMarkup;
  const chatId = event.chatId?.toString();

  if (!client || !chatId) return;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const playerId = client._selfInputPeer?.userId.toString() || "";
    const chat = globalState.registeredChats[chatId];
    const player = globalState.registeredPlayers[playerId];

    try {
      if (chat && player) {
        const cards = getAllButtonsText(replyMarkup);
        const selectedCardText = getRandom(cards);
        const selectedcard = Number(selectedCardText.split(" ")[0]);

        await sleep(globalState.selectCardDelay);
        await message.click({ text: selectedCardText });
        debug(`player ${player.name} from ${chat.name} choose ${selectedcard}`);

        globalState.selectedCards.add(chatId, selectedcard);
      }
    } catch {}
  }
}

export default selectCardHandler;
