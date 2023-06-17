import "dotenv/config";

import bot from "./botAccount.js";
import { CallbackQuery } from "telegram/events/CallbackQuery.js";
import callbackQueryHandler from "./handlers/callbackQueryHandler.js";
import globalState from "./services/globalState.js";
import debug from "./services/debug.js";
import initializeAllClients from "./services/initializeAllClients.js";
import commandHandler from "./handlers/commandHandler.js";
import { NewMessage } from "telegram/events/NewMessage.js";
import setBotCommands from "./extra/setBotCommands.js";

const env = process.env;

if (!env.BOT_TOKEN) {
  throw Error("Provide BOT_TOKEN");
}
const botToken = env.BOT_TOKEN;

bot.addEventHandler(callbackQueryHandler, new CallbackQuery({}));
bot.addEventHandler(commandHandler, new NewMessage({}));

(async () => {
  debug(`Global State getRegisteredChats()`);
  await globalState.getRegisteredChats();

  globalState.selectedCards.initialize();
  globalState.keepCard.initialize();

  const registeredChats = globalState.registeredChats;
  const registeredChatIds = Object.keys(registeredChats);
  const players = registeredChatIds
    .map((chatId) => {
      return Object.keys(registeredChats[chatId]?.players || {});
    })
    .flat();
  const totalClients = players.length;

  debug(`Successfully got ${totalClients} total clients`);

  await initializeAllClients(totalClients);
  await bot.start({
    botAuthToken: botToken,
  });
  await setBotCommands(bot);
  console.log(`Bot logged in successfully`);
})();
