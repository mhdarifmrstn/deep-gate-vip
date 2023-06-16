import { Api, TelegramClient } from "telegram";
import bot from "../botAccount.js";
import { Button } from "telegram/tl/custom/button.js";
import globalState from "./globalState.js";

class KeepCard {
  task: {
    [chatId: string]: {
      rows: number[];
      message?: Api.Message;
      waitingMessageId: number;
    };
  };
  bot: TelegramClient;

  constructor() {
    this.task = {};
    this.bot = bot;
  }

  initialize() {
    const chatIds = Object.keys(globalState.registeredChats);

    chatIds.map((chatId) => {
      this.task[chatId] = {
        rows: [],
        waitingMessageId: NaN,
      };
    });
  }

  async add(chatId: string, message: Api.Message, rows: string[]) {
    this.task[chatId].message = message;

    const waitingMessage = await bot.sendMessage(chatId, {
      message: "Pilih row mana cuy",
      buttons: bot.buildReplyMarkup(
        rows.map((row) => {
          return [Button.inline(row, Buffer.from(row))];
        })
      ),
    });
    this.task[chatId].waitingMessageId = waitingMessage.id;
  }

  async keepRow(chatId: string, text: string) {
    await this.task[chatId].message?.click({ text });
  }
}

export default KeepCard;
