import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import { Api } from "telegram";
import debug from "../../services/debug.js";

async function privateChatEditHandler(event: NewMessageEvent) {
  const messageText = event.message.message;
  const timeoutKeepIdMessage = "Waktu habis!\nRow";
  const timeoutKeepEnMessage = "Time's up!\nRow";
  const client = event.client;

  if (!client) return;

  const registeredChats = globalState.registeredChats;
  const registeredChatIds = Object.keys(registeredChats);
  const me = (await client.getMe()) as Api.User;
  const playerId = me.id.toString();
  const playerName = me.firstName;

  registeredChatIds.forEach(async (chatId) => {
    const registeredChat = registeredChats[chatId];

    if (registeredChat?.players[playerId]) {
      if (messageText.includes(timeoutKeepIdMessage) || messageText.includes(timeoutKeepEnMessage)) {
        const selectedRow = messageText.match(/\d/);
        const newText = `row ${selectedRow} telah dipilih oleh astaroth`;
        const waitingMessageId = globalState.keepCard.task[chatId.toString()].waitingMessageId;
        const bot = globalState.keepCard.bot;

        debug(`astaroth choose ${playerName} row ${selectedRow} because it has passed the time limit`);
        await bot.editMessage(chatId, { message: waitingMessageId, text: newText });
      }
    }
  });
}

export default privateChatEditHandler;
