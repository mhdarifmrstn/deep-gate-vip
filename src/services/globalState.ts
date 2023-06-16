import SelectCard from "./selectCardService.js";
import KeepCard from "./keepCardService.js";
import axios from "axios";

interface RegisteredChats {
  [id: string]:
    | {
        id: string;
        playerIds: string[];
      }
    | undefined;
}
interface GlobalState {
  startTime: number;
  astarothId: string;
  joinDelay: number;
  selectCardDelay: number;
  selectedCards: SelectCard;
  keepCard: KeepCard;
  totalClient: number;
  registeredChats: RegisteredChats;
  debug: boolean;
}
class GlobalState {
  constructor() {
    this.startTime = Date.now();
    this.astarothId = "2075925757";
    this.joinDelay = 2;
    this.selectCardDelay = 0;
    this.totalClient = 2;
    this.selectedCards = new SelectCard();
    this.keepCard = new KeepCard();
    this.registeredChats = {};
    this.debug = Boolean(process.env.DEEP_GATE_VIP_DEBUG);
  }

  async getRegisteredChats() {
    const REGISTERED_CHATS_CONFIG_URL = process.env.REGISTERED_CHATS_CONFIG_URL;

    if (!REGISTERED_CHATS_CONFIG_URL) {
      throw Error("Provide REGISTERED_CHATS_CONFIG_URL");
    }
    this.registeredChats = (await axios.get<RegisteredChats>(REGISTERED_CHATS_CONFIG_URL)).data;
  }
}
const globalState = new GlobalState();

export default globalState;
