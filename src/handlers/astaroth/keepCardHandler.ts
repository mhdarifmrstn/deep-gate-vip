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
  const registeredChatsKeys = Object.keys(registeredChats);

  const me = (await client.getMe()) as Api.User;
  const playerId = me.id;
  const playerName = me.firstName;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    registeredChatsKeys.forEach(async (key) => {
      const registeredChat = registeredChats[key];

      if (!registeredChat) return;

      try {
        const chat = (await client.getEntity(registeredChat.id)) as Api.Channel;

        if (registeredChat.playerIds.includes(playerId.toString())) {
          const rows = getAllButtonsText(replyMarkup);

          debug(`astaroth wants ${playerName} from ${chat.title} to keep their card on a row`);

          await globalState.keepCard.add(chat.id.toString(), message, rows);
        }
      } catch {}
    });
  }
}

export default keepCardHandler;
