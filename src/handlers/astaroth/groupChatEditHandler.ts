import { NewMessageEvent } from "telegram/events/index.js";
import astaroth from "./index.js";

async function groupChatEditHandler(event: NewMessageEvent) {
  const text = event.message.text;
  const playerCountIdText = "Pemain:";
  const playerCountEnText = "Players:";
  const firstLine = text.split("\n")[0];

  if (firstLine.includes(playerCountIdText) || firstLine.includes(playerCountEnText)) {
    astaroth.maxPlayerHandler(event);
  }
}

export default groupChatEditHandler;
