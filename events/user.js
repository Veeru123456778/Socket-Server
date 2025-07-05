// events/delivery.js

function registerUserHandlers(socket) {
    socket.on("join-work-area", (areaName) => {
      const room = `user_${areaName}`;
      socket.join(room);
      console.log(`User joined ${room}`);
    });
  }
  
  module.exports = { registerUserHandlers };
  