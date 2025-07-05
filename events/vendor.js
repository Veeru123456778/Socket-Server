// events/delivery.js

function registerVendorHandlers(socket) {
    socket.on("join-work-area", (areaName) => {
      const room = `vendor_${areaName}`;
      socket.join(room);
      console.log(`Vendor joined ${room}`);
    });

  }
  
  module.exports = { registerVendorHandlers };
  