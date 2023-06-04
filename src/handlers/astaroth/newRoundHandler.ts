import { Api } from "telegram";
import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function newRoundHandler(event: NewMessageEvent) {
  const chatId = (event.message?.peerId as Api.PeerChannel).channelId;
  globalState.selectedCards.clearCards(chatId.toString());

  const chat = (await event.client?.getEntity(chatId)) as Api.Channel;
  debug(`cleared selected cards on ${chat.title}`);
}

export default newRoundHandler;
