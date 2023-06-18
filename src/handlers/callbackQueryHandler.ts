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
    const x = globalState.callbackQuerySeparator;
    const data = query.data?.toString().split(x);
    const senderName = sender.firstName;

    if (registeredChat && data) {
      const option = data[0];

      if (option === "keepCard") {
        const keepCardId = Number(data[1]);
        const rowData = data[2];
        const rowNumber = rowData.split(" ")[0];
        const keepCard = globalState.keepCard;
        const currentChat = keepCard.task[chatId];

        if (keepCardId === currentChat.keepCardId) {
          debug(`${senderName} from ${registeredChat.name} memilih row ${rowNumber}`);

          await client.editMessage(chatId, {
            message: messageId,
            text: `${senderName} memilih row ${rowNumber}`,
          });
          await keepCard.keepRow(chatId.toString(), rowData);
        } else {
          await client.editMessage(chatId, {
            message: messageId,
            text: `${senderName}, task ini sudah tidak valid`,
          });
        }
      }
    }
  }
}

export default callbackQueryHandler;
