import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";
import getCurrentGame from "../../extra/getCurrentGame.js";

async function startGameHandler(event: NewMessageEvent) {
  const message = event.message;
  const client = event.client;
  const replyMarkup = message.replyMarkup;

  if (!client) return;

  const currentChatId = event.chatId?.toString() || "";
  const currentChat = globalState.registeredChats[currentChatId];
  const playerId = client._selfInputPeer?.userId.toString() || "";
  const player = globalState.registeredPlayers[playerId];
  const arePlayed = getCurrentGame(playerId);

  if (currentChat && player && !arePlayed) {
    if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
      const button = replyMarkup.rows[0].buttons[0];

      if (button.className === "KeyboardButtonUrl") {
        const startUrlParams = new URL(button.url).search;
        const gameId = new URLSearchParams(startUrlParams).get("start");

        if (!gameId) return;

        try {
          await globalState.joinGame(client, currentChat, gameId, player);
          debug(`Game start at ${currentChat.name} with ${player.name} as participant`);
        } catch (err) {
          debug(`Player ${player.name} can't join the game cause ${(err as Error).message}`);
        }
      }
    }
  }
}

export default startGameHandler;
