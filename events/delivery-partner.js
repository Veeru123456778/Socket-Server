// events/delivery.js

function registerDeliveryHandlers(socket) {
    socket.on("join-work-area", (workArea) => {
      const room = `delivery_partner_${workArea}`;
      socket.join(room);
      console.log(`Delivery partner joined ${room}`);
    });
  
    socket.on("delivery-request", ({ workArea, orderId, orderDetails }) => {
      const room = `delivery_partner_${workArea}`;
      socket.to(room).emit("new-delivery-request", { orderId, orderDetails });
      console.log(`Sent delivery request to ${room}`);
    });
  
    // ... add other delivery-specific events
  }
  
  module.exports = { registerDeliveryHandlers };
  