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
    const registeredChats = globalState.registeredChats;
    const chatIds = Object.keys(registeredChats);

    chatIds.map((chatId) => {
      const players = registeredChats[chatId]?.players || {};
      const totalClient = Object.keys(players).length;

      this.task[chatId] = {
        cards: [],
        totalClient,
      };
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
