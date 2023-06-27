import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";
import getCurrentGame from "../../extra/getCurrentGame.js";

async function privateChatEditHandler(event: NewMessageEvent) {
  const messageText = event.message.message;
  const timeoutKeepIdMessage = "Waktu habis!\nRow";
  const timeoutKeepEnMessage = "Time's up!\nRow";
  const client = event.client;

  if (!client) return;

  const playerId = client._selfInputPeer?.userId.toString() || "";
  const player = globalState.registeredPlayers[playerId];
  const arePlayed = getCurrentGame(playerId);

  if (player && arePlayed) {
    const chatIdTheyArePlayed = arePlayed;

    if (messageText.includes(timeoutKeepIdMessage) || messageText.includes(timeoutKeepEnMessage)) {
      const selectedRow = messageText.match(/\d/);
      const newText = `row ${selectedRow} telah dipilih oleh astaroth`;
      const waitingMessageId = globalState.keepCard.task[chatIdTheyArePlayed].waitingMessageId;
      const bot = globalState.keepCard.bot;

      debug(`astaroth choose ${player.name} row ${selectedRow} because it has passed the time limit`);
      await bot.editMessage(chatIdTheyArePlayed, { message: waitingMessageId, text: newText });
    }
  }
}

export default privateChatEditHandler;
