import { Api, TelegramClient } from "telegram";
import bot from "../botAccount.js";
import { Button } from "telegram/tl/custom/button.js";
import globalState from "./globalState.js";

class KeepCard {
  task: {
    [chatId: string]: {
      rows: number[];
      message?: Api.Message;
    };
  };
  bot: TelegramClient;

  constructor() {
    this.task = {};
    this.bot = bot;
  }

  initialize() {
    const chats = Object.values(globalState.registeredChats);

    chats.map((chat) => {
      if (chat) {
        this.task[chat.id] = {
          rows: [],
        };
      }
    });
  }

  async add(chatId: string, message: Api.Message, rows: string[]) {
    this.task[chatId].message = message;

    await bot.sendMessage(chatId, {
      message: "Pilih row mana cuy",
      buttons: bot.buildReplyMarkup(
        rows.map((row) => {
          return [Button.inline(row, Buffer.from(row))];
        })
      ),
    });
  }

  async keepRow(chatId: string, text: string) {
    await this.task[chatId].message?.click({ text });
  }
}

export default KeepCard;
