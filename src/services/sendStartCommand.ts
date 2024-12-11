import _ from "lodash";
import bot from "../botAccount.js";

// Provide a clickable start command
// This allows users to avoid typing the command manually
// and simply click to start a new game
export default async function sendStartCommand(chatId: string) {
  try {
    await bot.sendMessage(chatId, { message: "/startgame@astarothrobot" });
  } catch (err) {
    console.log(err);
  }
}
