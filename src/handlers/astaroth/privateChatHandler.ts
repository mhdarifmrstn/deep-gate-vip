import { NewMessageEvent } from "telegram/events/index.js";
import astaroth from "./index.js";

async function privateChatHandler(event: NewMessageEvent) {
  const text = event.message.text;
  const selectCardIdText = "Kartu mana yang akan kamu mainkan";
  const selectCardEnText = "Which card do you want to play";
  const keepCardIdText = "memilih row mana yang akan kamu simpan";
  const keepCardEnText = "choose which row to keep";

  if (text.includes(selectCardIdText) || text.includes(selectCardEnText)) {
    astaroth.selectCardHandler(event);
  } else if (text.includes(keepCardIdText) || text.includes(keepCardEnText)) {
    astaroth.keepCardHandler(event);
  }
}

export default privateChatHandler;
