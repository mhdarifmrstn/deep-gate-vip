import { Api } from "telegram";

function getAllButtonsText(replyMarkup: Api.ReplyInlineMarkup) {
  return replyMarkup.rows
    .map((row) => {
      return row.buttons.map((button) => button.text);
    })
    .flat();
}

export default getAllButtonsText;
