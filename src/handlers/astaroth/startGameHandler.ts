import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import { Api } from "telegram";

async function startGameHandler(event: NewMessageEvent) {
  const replyMarkup = event.message.replyMarkup;
  const chatId = (event.message.peerId as Api.PeerChannel).channelId;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const button = replyMarkup.rows[0].buttons[0];

    if (button.className === "KeyboardButtonUrl") {
      const startUrlParams = new URL(button.url).search;
      const gameId = new URLSearchParams(startUrlParams).get("start");
      const client = event.client;
      globalState.currentGroupId = chatId;

      await client?.sendMessage("@astarothrobot", { message: `/start ${gameId}` });
    }
  }
}

export default startGameHandler;
