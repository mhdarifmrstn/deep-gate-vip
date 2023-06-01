import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events/index.js";
import sleep from "../../extra/sleep.js";
import globalState from "../../services/globalState.js";
import getRandom from "../../extra/getRandom.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";

async function selectCardHandler(event: NewMessageEvent) {
  const client = event.client;
  const message = event.message;

  if (!client) return;

  const me = (await client.getMe()) as Api.User;
  const replyMarkup = message.replyMarkup;
  const registeredChats = globalState.registeredChats;
  const registeredChatsKeys = Object.keys(registeredChats);

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    registeredChatsKeys.forEach(async (key) => {
      const chat = registeredChats[key];

      if (!chat) return;

      const chatId = chat.id;

      if (chat.playerIds.includes(me.id.toString())) {
        const cards = getAllButtonsText(replyMarkup);
        const selectedCardText = getRandom(cards);
        const selectedcard = Number(selectedCardText.split(" ")[0]);

        await sleep(globalState.selectCardDelay);
        await message.click({ text: selectedCardText });

        globalState.selectedCards.add(chatId.toString(), selectedcard);
      }
    });
  }
}

export default selectCardHandler;
