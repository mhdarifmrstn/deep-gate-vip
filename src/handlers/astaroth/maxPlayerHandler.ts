import bigInt from "big-integer";
import { NewMessageEvent } from "telegram/events/index.js";
import bot from "../../botAccount.js";
import globalState from "../../services/globalState.js";

async function maxPlayerHandler(event: NewMessageEvent) {
  // This line could potentially cause bugs in the future
  // because we don't check if matched[0] is undefined before converting it to a number.
  // If matched[0] is undefined, it will be converted to NaN.
  // Currently, this isn't an issue because our if statements handle it correctly.
  const totalJoinedPlayers = Number(event.message.text.match(/\d+/g)?.[0]);
  const botApiChatId = "-100" + event.chatId?.toJSNumber();
  const currentPlayerLimit = globalState.getCachedPlayerLimit(botApiChatId);

  if (totalJoinedPlayers >= currentPlayerLimit) {
    const forceStarterId = bigInt(Number(process.env.FORCE_STARTER_ID || 1));

    if (forceStarterId) {
      const currentClientId = event.client?._selfInputPeer?.userId;

      if (currentClientId?.equals(forceStarterId)) {
        await event.message.reply({ message: "/forcestart" });
      }
    } else {
      botApiChatId && (await bot.sendMessage(botApiChatId, { message: "/forcestart" }));
    }
  }
}

export default maxPlayerHandler;
