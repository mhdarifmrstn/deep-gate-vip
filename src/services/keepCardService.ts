import { Api, TelegramClient } from "telegram";
import bot from "../botAccount.js";
import globalState from "./globalState.js";
import { Button } from "telegram/tl/custom/button.js";

class KeepCard {
  rows: number[];
  bot: TelegramClient;
  message?: Api.Message;

  constructor() {
    this.rows = [];
    this.bot = bot;
    this.message = undefined;
  }

  async add(message: Api.Message, rows: string[]) {
    this.message = message;

    await bot.sendMessage(globalState.currentGroupId, {
      message: "Pilih row mana cuy",
      buttons: bot.buildReplyMarkup(
        rows.map((row) => {
          return [Button.inline(row, Buffer.from(row))];
        })
      ),
    });
  }

  async keepRow(text: string) {
    await this.message?.click({ text });
  }
}

export default KeepCard;
