import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function newRoundHandler(event: NewMessageEvent) {
  const chatId = event.chatId?.toString() || "";
  const registeredChat = globalState.registeredChats[chatId];

  if (registeredChat) {
    const cleared = globalState.selectedCards.clearCards(chatId);
    if (cleared) debug(`cleared selected cards on ${registeredChat.name}`);
  }
}

export default newRoundHandler;
