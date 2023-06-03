import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import { Api } from "telegram";
import debug from "../../services/debug.js";

async function startGameHandler(event: NewMessageEvent) {
  const message = event.message;
  const client = event.client;
  const replyMarkup = message.replyMarkup;

  if (!client) return;

  const chatId = (message.peerId as Api.PeerChannel).channelId;
  const chat = (await client.getEntity(chatId)) as Api.Channel;
  const player = (await client.getMe()) as Api.User;
  const playerId = player.id.toString();
  const playerName = player.firstName;
  const registeredChat = globalState.registeredChats[chatId.toString()];

  if (!registeredChat) return;
  if (!registeredChat.playerIds.includes(playerId)) return;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const button = replyMarkup.rows[0].buttons[0];

    if (button.className === "KeyboardButtonUrl") {
      const startUrlParams = new URL(button.url).search;
      const gameId = new URLSearchParams(startUrlParams).get("start");

      debug(`game start at ${chat.title} with ${playerName} as participant`);
      await client.sendMessage("@astarothrobot", { message: `/start ${gameId}` });
    }
  }
}

export default startGameHandler;
