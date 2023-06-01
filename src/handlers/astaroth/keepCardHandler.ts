import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";

async function keepCardHandler(event: NewMessageEvent) {
  const message = event.message;
  const replyMarkup = message.replyMarkup;

  const registeredChats = globalState.registeredChats;
  const registeredChatsKeys = Object.keys(registeredChats);

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    registeredChatsKeys.forEach(async (key) => {
      const chat = registeredChats[key];

      if (!chat) return;

      const chatId = chat.id;
      const rows = getAllButtonsText(replyMarkup);

      await globalState.keepCard.add(chatId.toString(), message, rows);
    });
  }
}

export default keepCardHandler;
