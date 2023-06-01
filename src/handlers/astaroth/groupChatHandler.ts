import { NewMessageEvent } from "telegram/events/index.js";
import astaroth from "./index.js";

async function groupChatHandler(event: NewMessageEvent) {
  const text = event.message.text;
  const startGameIdText = "Sebuah permainan baru telah dimulai";
  const startGameEnText = "A new game has been started";

  if (text.includes(startGameIdText) || text.includes(startGameEnText)) {
    astaroth.startGameHandler(event);
  }
}

export default groupChatHandler;
