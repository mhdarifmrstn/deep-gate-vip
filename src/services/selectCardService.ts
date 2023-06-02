import { TelegramClient } from "telegram";
import bot from "../botAccount.js";
import globalState from "./globalState.js";

class SelectCard {
  task: {
    [chatId: string]: {
      cards: number[];
      totalClient: number;
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
          cards: [],
          totalClient: chat.playerIds.length,
        };
      }
    });
  }

  async add(chatId: string, card: number) {
    const chatTask = this.task[chatId];
    chatTask.cards.push(card);

    if (chatTask.cards.length >= chatTask.totalClient) {
      this.orderCards(chatId);
      await this.sendMessage(chatId);
      this.clearCards(chatId);
    }
  }

  orderCards(chatId: string) {
    this.task[chatId].cards.sort((cardX, cardY) => cardX - cardY);
  }

  async sendMessage(chatId: string) {
    await this.bot.sendMessage(chatId, {
      message: `Kartu yang dipilih: ${this.task[chatId].cards.join(" ")}`,
    });
  }

  clearCards(chatId: string) {
    this.task[chatId].cards = [];
  }
}

export default SelectCard;
