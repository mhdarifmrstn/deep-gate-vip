import { NewMessageEvent } from "telegram/events/index.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";
import globalState from "../../services/globalState.js";

async function keepCardHandler(event: NewMessageEvent) {
  const message = event.message;
  const replyMarkup = message.replyMarkup;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const rows = getAllButtonsText(replyMarkup);
    await globalState.keepCard.add(message, rows);
  }
}

export default keepCardHandler;
