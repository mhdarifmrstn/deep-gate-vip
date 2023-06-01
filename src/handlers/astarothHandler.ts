// import { NewMessageEvent } from "telegram/events/index.js";
// import startGameHandler from "./astaroth/startGameHandler.js";
// import selectCardHandler from "./astaroth/selectCardHandler.js";
// import keepCardHandler from "./astaroth/keepCardHandler.js";

// async function astarothHandler(event: NewMessageEvent) {
//   const text = event.message.text;
//   const startGameIdText = "Sebuah permainan baru telah dimulai";
//   const startGameEnText = "A new game has been started";
//   const message = event.message;

//   if (text.includes(startGameIdText) || text.includes(startGameEnText)) {
//     startGameHandler(event);
//   }
//   if (event.isPrivate && !message.fromId) {
//     const selectCardIdText = "Which card do you want to play"; // translate this later, test play using Ezra's account
//     const selectCardEnText = "Which card do you want to play";
//     const keepCardIdText = "choose which row to keep";
//     const keepCardEnText = "choose which row to keep";

//     if (text.includes(selectCardIdText) || text.includes(selectCardEnText)) {
//       selectCardHandler(event);
//     } else if (text.includes(keepCardIdText) || text.includes(keepCardEnText)) {
//       keepCardHandler(event);
//     }
//   }
// }

// export default astarothHandler;
