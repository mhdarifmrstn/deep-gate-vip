import SelectCard from "./selectCardService.js";
import KeepCard from "./keepCardService.js";
import axios from "axios";
import { Redis } from "ioredis";
import { TelegramClient } from "telegram";

interface Player {
  id: string;
  name: string;
}
interface Chat {
  id: string;
  name: string;
}
interface Players {
  [id: string]: Player | undefined;
}
interface Chats {
  [id: string]: Chat | undefined;
}
interface ChatPlayers {
  [chatId: string]: {
    [playerId: string]: Player | undefined;
  };
}
interface ConfigResponse {
  chats: Chats;
  players: Players;
}
interface PlayerLimit {
  [chatId: string]: number | undefined;
}
interface GlobalState {
  startTime: number;
  astarothId: string;
  joinDelay: number;
  selectCardDelay: number;
  selectedCards: SelectCard;
  keepCard: KeepCard;
  registeredChats: Chats;
  registeredPlayers: Players;
  debug: boolean;
  redisClient: Redis;
  playerLimit: PlayerLimit;
  chatPlayers: ChatPlayers;
  lastJoinTask: Promise<any>;
  callbackQuerySeparator: string;
}
class GlobalState {
  constructor() {
    this.startTime = Date.now();
    this.astarothId = "2075925757";
    this.joinDelay = 0;
    this.selectCardDelay = 0;
    this.selectedCards = new SelectCard();
    this.keepCard = new KeepCard();
    this.registeredChats = {};
    this.debug = Boolean(process.env.DEEP_GATE_VIP_DEBUG);
    this.redisClient = new Redis(process.env.REDIS_URL || "");
    this.playerLimit = {};
    this.chatPlayers = {};
    this.lastJoinTask = Promise.resolve();
    this.callbackQuerySeparator = "_";
  }

  async joinGame(client: TelegramClient, chat: Chat, gameId: string, player: Player) {
    const currentJoinTask = new Promise(async (resolve, reject) => {
      try {
        await this.lastJoinTask;
      } catch (err) {
        reject(err);
      }
      const chatId = chat.id;
      const playerId = player.id;

      if (!this.chatPlayers[chatId]) {
        this.chatPlayers[chatId] = {
          [playerId]: {
            id: playerId,
            name: player.name,
          },
        };
      }
      const currentPlayers = this.chatPlayers[chatId];
      if (!currentPlayers) reject({ message: "currentPlayers is undefined" });
      const totalCurrentPlayers = Object.keys(currentPlayers).length;
      const playerLimit = await this.getPlayerLimit(chatId);

      if (totalCurrentPlayers < playerLimit) {
        await client.sendMessage("@astarothrobot", { message: `/start ${gameId}` });
        currentPlayers[playerId] = player;
      } else {
        reject({ message: "the slot is full" });
      }
      resolve("");
    });
    this.lastJoinTask = currentJoinTask;
    return currentJoinTask;
  }

  clearChatPlayers(chatId: string) {
    delete this.chatPlayers[chatId];
    this.lastJoinTask = Promise.resolve();
  }

  async getConfig() {
    const CONFIG_URL = process.env.CONFIG_URL;

    if (!CONFIG_URL) {
      throw Error("Provide CONFIG_URL");
    }
    const config = (await axios.get<ConfigResponse>(CONFIG_URL)).data;
    this.registeredChats = config.chats;
    this.registeredPlayers = config.players;
  }

  async getPlayerLimit(chatId: string) {
    let currentGroupLimit = this.playerLimit[chatId];

    if (!currentGroupLimit) {
      const defaultLimit = 2;
      currentGroupLimit = Number(await this.redisClient.get(`${chatId}-player-limit`)) || defaultLimit;
      this.playerLimit[chatId] = currentGroupLimit;
    }
    return currentGroupLimit;
  }

  async setPlayerLimit(chatId: string, limit: number) {
    this.playerLimit[chatId] = limit;
    await this.redisClient.set(`${chatId}-player-limit`, String(limit));
  }
}
const globalState = new GlobalState();

export default globalState;
