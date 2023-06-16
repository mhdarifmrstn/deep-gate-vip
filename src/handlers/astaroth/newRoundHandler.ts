import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function newRoundHandler(event: NewMessageEvent) {
  const chatId = event.chatId?.toString() || "";
  const registeredChat = globalState.registeredChats[chatId];

  if (registeredChat) {
    globalState.selectedCards.clearCards(chatId);
    debug(`cleared selected cards on ${registeredChat.name}`);
  }
}

export default newRoundHandler;
