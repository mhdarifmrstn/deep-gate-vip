import { NewMessageEvent } from "telegram/events/index.js";
import sleep from "../../extra/sleep.js";
import globalState from "../../services/globalState.js";
import getRandom from "../../extra/getRandom.js";
import getAllButtonsText from "../../extra/getAllButtonsText.js";

async function selectCardHandler(event: NewMessageEvent) {
  const client = event.client;
  if (!client) return;

  const message = event.message;
  const replyMarkup = message.replyMarkup;

  if (replyMarkup && replyMarkup.className === "ReplyInlineMarkup") {
    const cards = getAllButtonsText(replyMarkup);
    const selectedCard = getRandom(cards);

    await sleep(globalState.selectCardDelay);
    await message.click({ text: selectedCard });

    globalState.selectedCards.add(Number(selectedCard.split(" ")[0]));
  }
}

export default selectCardHandler;
