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

  const me = (await client.getMe()) as Api.User;
  const playerId = me.id;
  const playerName = me.firstName;
  const replyMarkup = message.replyMarkup;
  const registeredChats = globalState.registeredChats;
  const registeredChatsKeys = Object.keys(registeredChats);

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    registeredChatsKeys.forEach(async (key) => {
      const registeredChat = registeredChats[key];

      if (!registeredChat) return;

      try {
        const chat = (await client.getEntity(registeredChat.id)) as Api.Channel;

        if (registeredChat.playerIds.includes(playerId.toString())) {
          const cards = getAllButtonsText(replyMarkup);
          const selectedCardText = getRandom(cards);
          const selectedcard = Number(selectedCardText.split(" ")[0]);

          await sleep(globalState.selectCardDelay);
          await message.click({ text: selectedCardText });
          debug(`player ${playerName} from ${chat.title} choose ${selectedcard}`);

          globalState.selectedCards.add(chat.id.toString(), selectedcard);
        }
      } catch {}
    });
  }
}

export default selectCardHandler;
