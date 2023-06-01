import bigInt from "big-integer";
import SelectCard from "./selectCardService.js";
import KeepCard from "./keepCardService.js";

interface GlobalState {
  startTime: number;
  astarothId: number;
  joinDelay: number;
  selectCardDelay: number;
  selectedCards: SelectCard;
  keepCard: KeepCard;
  totalClient: number;
  currentGroupId: bigInt.BigInteger;
}
class GlobalState {
  constructor() {
    this.startTime = Date.now();
    this.astarothId = 2075925757;
    this.joinDelay = 2;
    // this.selectCardDelay = 1;
    this.selectCardDelay = 0;
    this.totalClient = 2;
    this.selectedCards = new SelectCard(this.totalClient);
    this.keepCard = new KeepCard();
    this.currentGroupId = bigInt(12345);
  }
}
const globalState = new GlobalState();

export default globalState;
