import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function privateChatEditHandler(event: NewMessageEvent) {
  const messageText = event.message.message;
  const timeoutKeepIdMessage = "Waktu habis!\nRow";
  const timeoutKeepEnMessage = "Time's up!\nRow";
  const client = event.client;
  const chatId = event.chatId?.toString();

  if (!client || !chatId) return;

  const playerId = client._selfInputPeer?.userId.toString() || "";
  const chat = globalState.registeredChats[chatId];
  const player = globalState.registeredPlayers[playerId];

  if (chat && player) {
    if (messageText.includes(timeoutKeepIdMessage) || messageText.includes(timeoutKeepEnMessage)) {
      const selectedRow = messageText.match(/\d/);
      const newText = `row ${selectedRow} telah dipilih oleh astaroth`;
      const waitingMessageId = globalState.keepCard.task[chatId.toString()].waitingMessageId;
      const bot = globalState.keepCard.bot;

      debug(`astaroth choose ${player.name} row ${selectedRow} because it has passed the time limit`);
      await bot.editMessage(chatId, { message: waitingMessageId, text: newText });
    }
  }
}

export default privateChatEditHandler;
