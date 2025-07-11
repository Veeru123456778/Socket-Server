// events/delivery.js

function registerVendorHandlers(socket) {
    
    socket.on("join-work-area", ({workArea,workCity}) => {
        const areaRoom = `vendor_${workCity}_${workArea}`;
        const personalRoom = `vendor__${socket.user.id}`;
      
        socket.join(areaRoom);       // for broadcast requests
        socket.join(personalRoom);   // for direct, personal updates
      
        console.log(`Vendor joined area room: ${areaRoom}`);
        console.log(`Vendor joined personal room: ${personalRoom}`);
      });
      
    
    socket.on("order-ready", (orderPayload) => {
        const { workArea,workCity, orderId, orderDetails } = orderPayload;
    
        const targetRoom = `delivery_partner_${workCity}_${workArea}`;
    
        console.log(`Emitting delivery request to ${targetRoom}`);
        // Should be handled in frontend of delivery partner
        socket.to(targetRoom).emit("delivery-request", {
          orderId,
          orderDetails,
          fromVendor: socket.user?.id || "unknown", // if you use JWT
          time: new Date().toISOString()
        });
      });


    socket.on("order-accepted-by-vendor", ({ orderId, userId }) => {
        const userRoom = `user_${userId}`;
        
        // Notify the user that the vendor accepted the order
        socket.to(userRoom).emit("vendor-order-accepted", {
          orderId,
          message: "Your order has been accepted by the vendor",
        });
    
        console.log(`Vendor accepted order ${orderId}, notified user in room ${userRoom}`);
      });

      
  }
  
  module.exports = { registerVendorHandlers };
  