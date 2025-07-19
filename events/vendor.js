// events/delivery.js
const axios = require("axios");
  
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
        const { workArea,workCity} = orderPayload;
    
        const targetRoom = `delivery_partner_${workCity}_${workArea}`;
    
        console.log(`Emitting delivery request to ${targetRoom}`);
        // Should be handled in frontend of delivery partner
        socket.to(targetRoom).emit("delivery-request", orderPayload);
      
      });
      
        
      socket.on("order-accepted-by-vendor", async ({ orderId, userId }) => {
      const vendorId = socket.user?.id;
      const userRoom = `user_${userId}`;

      try {
        // 🔄 Update the order in backend
        // await axios.post("https://your-backend.com/api/orders/vendor-accept", {
        //   orderId,
        //   vendorId,
        // });

        // ✅ Notify the user via socket
        socket.to(userRoom).emit("vendor-order-accepted", {
          orderId,
          message: "Your order has been accepted by the vendor",
        });

        console.log(`Vendor ${vendorId} accepted order ${orderId}, notified user ${userRoom}`);
      } catch (err) {
        console.error("Failed to update vendor in order:", err.message);
      }
      });


  }
  
  module.exports = { registerVendorHandlers };
  


  
        // socket.to(targetRoom).emit("delivery-request", {
        //   orderId,
        //   orderDetails,
        //   fromVendor: socket.user?.id || "unknown", // if you use JWT
        //   time: new Date().toISOString()
        // });

        
    // socket.on("order-accepted-by-vendor", ({ orderId, userId }) => {
    //     const userRoom = `user_${userId}`;
        
    //     // Notify the user that the vendor accepted the order
    //     socket.to(userRoom).emit("vendor-order-accepted", {
    //       orderId,
    //       message: "Your order has been accepted by the vendor",
    //     });
    
    //     console.log(`Vendor accepted order ${orderId}, notified user in room ${userRoom}`);
    //   });