import { CallbackQueryEvent } from "telegram/events/CallbackQuery.js";
import globalState from "../services/globalState.js";
import debug from "../services/debug.js";

async function callbackQueryHandler(event: CallbackQueryEvent) {
  const query = event.query;
  const client = event.client;
  const sender = await event.getSender();

  if (!client) return;
  if (!sender) return;

  if (
    query.className === "UpdateBotCallbackQuery" &&
    query.peer.className === "PeerChannel" &&
    sender.className === "User"
  ) {
    const chatId = event.chatId?.toString() || "";
    const registeredChat = globalState.registeredChats[chatId];
    const messageId = query.msgId;
    const data = query.data?.toString();
    const senderName = sender.firstName;

    if (registeredChat && data) {
      const rowNumber = data.split(" ")[0];
      debug(`${senderName} from ${registeredChat.name} memilih row ${rowNumber}`);

      await client.editMessage(chatId, {
        message: messageId,
        text: `${senderName} memilih row ${rowNumber}`,
      });
      await globalState.keepCard.keepRow(chatId.toString(), data);
    }
  }
}

export default callbackQueryHandler;
