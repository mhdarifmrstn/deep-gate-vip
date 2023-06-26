import globalState from "../services/globalState.js";

function getCurrentGame(playerId: string) {
  const chatPlayers = globalState.chatPlayers;
  const activeChadIds = Object.keys(chatPlayers);
  const totalActiveChat = activeChadIds.length;

  for (let i = 0; i < totalActiveChat; i++) {
    const chatId = activeChadIds[i];

    if (chatPlayers[chatId][playerId]) {
      return chatId;
    }
  }
}

export default getCurrentGame;
