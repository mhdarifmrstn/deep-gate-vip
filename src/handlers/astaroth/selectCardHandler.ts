import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events/index.js";
import sleep from "../../extra/sleep.js";
import globalState from "../../services/globalState.js";
import getRandom from "../../extra/getRandom.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import debug from "../../services/debug.js";

async function selectCardHandler(event: NewMessageEvent) {
  const client = event.client;
  const message = event.message;
  if (!client) return;
  const me = client._selfInputPeer;
  const playerId = me?.userId.toString() || "";
  const replyMarkup = message.replyMarkup;
  const registeredChats = globalState.registeredChats;
  const registeredChatIds = Object.keys(registeredChats);

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    registeredChatIds.forEach(async (chatId) => {
      const registeredChat = registeredChats[chatId];
      const player = registeredChat?.players[playerId];

      try {
        if (player) {
          const cards = getAllButtonsText(replyMarkup);
          const selectedCardText = getRandom(cards);
          const selectedcard = Number(selectedCardText.split(" ")[0]);

          await sleep(globalState.selectCardDelay);
          await message.click({ text: selectedCardText });
          debug(`player ${player.name} from ${registeredChat.name} choose ${selectedcard}`);

          globalState.selectedCards.add(chatId, selectedcard);
        }
      } catch {}
    });
  }
}

export default selectCardHandler;
