import { TelegramClient } from "telegram";
import bot from "../botAccount.js";
import globalState from "./globalState.js";

class SelectCard {
  task: {
    [chatId: string]: {
      cards: number[];
      totalClient: number;
      cardsCleared: boolean;
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
      const players = globalState.registeredPlayers;
      const totalClient = Object.keys(players).length;

      this.task[chatId] = {
        cards: [],
        totalClient,
        cardsCleared: false,
      };
    });
  }

  async add(chatId: string, card: number) {
    const chatTask = this.task[chatId];
    const totalPlayer = globalState.totalJoinCurrentGame[chatId];

    chatTask.cards.push(card);

    if (chatTask.cards.length >= totalPlayer) {
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
    const currentChat = this.task[chatId];

    if (!currentChat.cardsCleared) {
      currentChat.cards = [];
      currentChat.cardsCleared = true;

      // to prevent multiple clearCards events fired at the same time
      // cause we only need to clear it once on every round
      setTimeout(() => {
        currentChat.cardsCleared = false;
      }, 5000);

      return true;
    }
    return false;
  }
}

export default SelectCard;
