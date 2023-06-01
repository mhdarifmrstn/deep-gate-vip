import { CallbackQueryEvent } from "telegram/events/CallbackQuery.js";
import globalState from "../services/globalState.js";

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
    const chatId = query.peer.channelId;
    const messageId = query.msgId;
    const data = query.data?.toString();

    if (data) {
      const rowNumber = data.split(" ")[0];

      await client.editMessage(chatId, {
        message: messageId,
        text: `${sender.firstName} memilih row ${rowNumber}`,
      });
      await globalState.keepCard.keepRow(chatId.toString(), data);
    }
  }
}

export default callbackQueryHandler;
