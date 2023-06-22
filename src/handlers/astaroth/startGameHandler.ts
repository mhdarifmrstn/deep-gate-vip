import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function startGameHandler(event: NewMessageEvent) {
  const message = event.message;
  const client = event.client;
  const replyMarkup = message.replyMarkup;

  if (!client) return;

  const chatId = event.chatId?.toString() || "";
  const chat = globalState.registeredChats[chatId];
  const meId = client._selfInputPeer?.userId.toString() || "";
  const player = globalState.registeredPlayers[meId];

  if (chat && player)
    if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
      const button = replyMarkup.rows[0].buttons[0];

      if (button.className === "KeyboardButtonUrl") {
        const startUrlParams = new URL(button.url).search;
        const gameId = new URLSearchParams(startUrlParams).get("start");

        if (!gameId) return;

        try {
          await globalState.joinGame(client, chatId, gameId);
          debug(`Game start at ${chat.name} with ${player.name} as participant`);
        } catch (_err) {
          debug(`Player ${player.name} can't join the game cause the slot is full`);
        }
      }
    }
}

export default startGameHandler;
