import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";
import _ from "lodash";
import sendStartCommand from "../../services/sendStartCommand.js";

async function endGameHandler(event: NewMessageEvent) {
  await _.throttle(() => _endGameHandler(event), 5000)();
}
async function _endGameHandler(event: NewMessageEvent) {
  const chatId = event.chatId?.toString() || "";
  const chat = globalState.registeredChats[chatId];

  if (chat) {
    globalState.clearChatPlayers(chatId);
    debug(`Cleared chat players game on ${chat.name}`);
    await sendStartCommand(chatId);
  }
}

export default endGameHandler;
