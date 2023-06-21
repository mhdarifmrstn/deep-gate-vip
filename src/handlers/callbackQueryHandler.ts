import { CallbackQueryEvent } from "telegram/events/CallbackQuery.js";
import globalState from "../services/globalState.js";
import debug from "../services/debug.js";
import bot from "../botAccount.js";
import { Button } from "telegram/tl/custom/button.js";
import { ButtonLike } from "telegram/define.js";

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
            text: `${senderName}, task ini sudah invalid`,
          });
        }
      } else if (option === "config") {
        const configType = data[1];
        const configName = data[2];

        if (configType === "select") {
          if (configName === "totalPlayer") {
            const arr = [...Array(18).keys()];
            const buttons: ButtonLike[][] = [];

            while (arr.length) {
              const rows = arr.splice(0, 3);

              buttons.push(
                rows.map((n) => {
                  const totalPlayer = String(n + 3);
                  const callbackText = `config${x}set${x}${configName}${x}${totalPlayer}`;
                  return Button.inline(totalPlayer, Buffer.from(callbackText));
                })
              );
            }
            await client.editMessage(chatId, {
              message: messageId,
              text: "Berapa jumlah pemain yang lu prefer?",
              buttons: bot.buildReplyMarkup(buttons),
            });
          }
        } else if (configType === "set") {
          if (configName === "totalPlayer") {
            const newTotalPlayer = Number(data[3]);
            const validTotalPlayer = !isNaN(newTotalPlayer) && newTotalPlayer > 2 && newTotalPlayer < 21;

            if (validTotalPlayer) {
              await globalState.setPlayerLimit(chatId, newTotalPlayer - 1);
              await client.editMessage(chatId, {
                message: messageId,
                text: `Berhasil mengubah minimal jumlah pemain menjadi ${newTotalPlayer}`,
              });
            } else {
              await client.editMessage(chatId, {
                message: messageId,
                text: "Tidak berhasil mengubah minimal jumlah pemain",
              });
            }
          }
        }
      }
    }
  }
}

export default callbackQueryHandler;
