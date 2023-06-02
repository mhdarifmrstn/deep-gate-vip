import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import { Api } from "telegram";

async function startGameHandler(event: NewMessageEvent) {
  const message = event.message;
  const client = event.client;
  const replyMarkup = message.replyMarkup;

  if (!client) return;

  const chatId = (message.peerId as Api.PeerChannel).channelId;
  const player = (await client.getMe()) as Api.User;
  const playerId = player.id.toString();
  const registeredChat = globalState.registeredChats[chatId.toString()];

  if (!registeredChat) return;
  if (!registeredChat.playerIds.includes(playerId)) return;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const button = replyMarkup.rows[0].buttons[0];

    if (button.className === "KeyboardButtonUrl") {
      const startUrlParams = new URL(button.url).search;
      const gameId = new URLSearchParams(startUrlParams).get("start");

      await client.sendMessage("@astarothrobot", { message: `/start ${gameId}` });
    }
  }
}

export default startGameHandler;
