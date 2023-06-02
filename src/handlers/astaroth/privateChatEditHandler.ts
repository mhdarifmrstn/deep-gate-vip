import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../../services/globalState.js";
import { Api } from "telegram";

async function privateChatEditHandler(event: NewMessageEvent) {
  const messageText = event.message.message;
  const timeoutKeepIdMessage = "Waktu habis!\nRow";
  const timeoutKeepEnMessage = "Time's up!\nRow";
  const client = event.client;

  if (!client) return;

  const registeredChats = globalState.registeredChats;
  const registeredChatsKeys = Object.keys(registeredChats);
  const me = (await client.getMe()) as Api.User;

  registeredChatsKeys.forEach(async (key) => {
    const chat = registeredChats[key];

    if (!chat) return;

    const chatId = chat.id;

    if (chat.playerIds.includes(me.id.toString())) {
      if (messageText.includes(timeoutKeepIdMessage) || messageText.includes(timeoutKeepEnMessage)) {
        const selectedRow = messageText.match(/\d/);
        const newText = `row ${selectedRow} telah dipilih oleh astaroth`;
        const waitingMessageId = globalState.keepCard.task[chatId.toString()].waitingMessageId;
        const bot = globalState.keepCard.bot;

        await bot.editMessage(chatId, { message: waitingMessageId, text: newText });
      }
    }
  });
}

export default privateChatEditHandler;
