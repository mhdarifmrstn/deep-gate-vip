import { TelegramClient } from "telegram";
import bot from "../botAccount.js";
import globalState from "./globalState.js";

class SelectCard {
  cards: number[];
  totalClient: number;
  bot: TelegramClient;

  constructor(totalClient: number) {
    this.cards = [];
    this.totalClient = totalClient;
    this.bot = bot;
  }

  async add(card: number) {
    this.cards.push(card);

    if (this.cards.length >= this.totalClient) {
      this.orderCards();
      await this.sendMessage();
      this.clear();
    }
  }

  orderCards() {
    this.cards.sort((cardX, cardY) => cardX - cardY);
  }

  async sendMessage() {
    await this.bot.sendMessage(globalState.currentGroupId, {
      message: `Kartu yang dipilih: ${this.cards.join(", ")}`,
    });
  }

  clear() {
    this.cards = [];
  }
}

export default SelectCard;
