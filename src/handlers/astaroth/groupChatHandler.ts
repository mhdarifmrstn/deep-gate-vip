import { NewMessageEvent } from "telegram/events/index.js";
import astaroth from "./index.js";
import globalState from "../../services/globalState.js";
import debug from "../../services/debug.js";

async function groupChatHandler(event: NewMessageEvent) {
  const text = event.message.text;
  const startGameIdText = "Sebuah permainan baru telah dimulai";
  const startGameEnText = "A new game has been started";
  const newRoundIdText = "[Ronde ";
  const newRoundEnText = "[Round ";
  const notEnoughPlayerIdText = "Jumlah pemain tidak cukup. Permainan dibatalkan";
  const notEnoughPlayerEnText = "Not enough players. Game removed";
  const gameKilledIdText = "Aye! Game has been killed!";
  const gameKilledEnText = "Aye! Permainan sudah diberhentikan!";
  const gameEndedIdText = "Memenangkan permainan! Permainan berakhir!";
  const gameEndedEnText = "won the game! Game ended!";
  const chatId = event.chatId?.toString() || "";
  const chatName = globalState.registeredChats[chatId]?.name;

  if (text.includes(startGameIdText) || text.includes(startGameEnText)) {
    astaroth.startGameHandler(event);
  }
  if (text.includes(newRoundIdText) || text.includes(newRoundEnText)) {
    astaroth.newRoundHandler(event);
  }
  if (text.includes(notEnoughPlayerIdText) || text.includes(notEnoughPlayerEnText)) {
    globalState.clearChatPlayers(chatId);
    debug(`Cleared total join game on ${chatName}`);
  }
  if (text.includes(gameKilledIdText) || text.includes(gameKilledEnText)) {
    globalState.clearChatPlayers(chatId);
    debug(`Cleared total join game on ${chatName}`);
  }
  if (text.includes(gameEndedIdText) || text.includes(gameEndedEnText)) {
    globalState.clearChatPlayers(chatId);
    debug(`Cleared total join game on ${chatName}`);
  }
}

export default groupChatHandler;
