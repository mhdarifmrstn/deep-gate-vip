import bigInt from "big-integer";
import { Api } from "telegram";
import { sleep } from "telegram/Helpers.js";
import { NewMessageEvent } from "telegram/events/index.js";

// import fs from "fs";

// const graveyardLogFileStream = fs.createWriteStream(process.cwd() + "/graveyardStartGameLog.json", { flags: "a" });

// async function customGraveyardLogMiddleware(event: NewMessageEvent) {
//   const message = event.message;
//   const fromId = message.fromId;

//   if (fromId instanceof Api.PeerUser) {
//     if (fromId.userId.equals(bigInt(2075925757))) {
//       const text = message.text;

//       if (text.includes("Sebuah permainan baru telah dimulai")) {
//         console.log(text);

//         graveyardLogFileStream.write(JSON.stringify(message));
//         graveyardLogFileStream.write(",");
//       }
//     }
//   }
// }
function getRandom<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}
function getAllButtonTexts(replyMarkup: Api.ReplyInlineMarkup) {
  return replyMarkup.rows
    .map((row) => {
      return row.buttons.map((button) => button.text);
    })
    .flat();
}
async function customGraveyardLogMiddleware(event: NewMessageEvent) {
  const message = event.message;
  const peerId = message.peerId;

  if (peerId.className === "PeerUser") {
    if (peerId.userId.equals(bigInt(609517172))) {
      const replyMarkup = message.replyMarkup;

      if (replyMarkup) {
        if (replyMarkup.className === "ReplyInlineMarkup") {
          // called cards cause we wanna select astaroth cards
          const cards = getAllButtonTexts(replyMarkup);

          await sleep(1000);

          const selectedCard = getRandom(cards);
          message.click({ text: selectedCard });
          console.log("clicked", selectedCard);
        }
      }
    }
  }
}

export default customGraveyardLogMiddleware;
