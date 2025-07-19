// events/delivery.js

function registerDeliveryHandlers(socket) {

    socket.on("join-work-area", ({ workArea, workCity }) => {
      const areaRoom = `delivery_partner_${workCity}_${workArea}`;
      const personalRoom = `delivery_partner_${socket.user.id}`;  

      socket.join(areaRoom);       // for broadcast requests
      socket.join(personalRoom);   // for direct, personal updates
    
      console.log(`Delivery partner joined area room: ${areaRoom}`);
      console.log(`Delivery partner joined personal room: ${personalRoom}`);
    });
    
  
    socket.on("update-location", ({orderId,userId, location }) => {
      console.log(`Location update from partner: Order ${orderId}`, location);
  
      // Emit to user room for live tracking
      const userRoom = `user_${userId}`; // join this room from user side
      // const userRoom = `user_order_${orderId}`; // join this room from user side
      socket.to(userRoom).emit("delivery-location-update", {
        orderId,
        location,
      });
    });
    
    socket.on("delivery-request-accepted", async ({ orderId, vendorId, userId }) => {
      const deliveryPartnerId = socket.user?.id;

      try {
        // Update DB via backend API
        // await axios.post("https://your-backend.com/api/orders/update-delivery", {
        //   orderId,
        //   deliveryPartnerId,
        // });

        // Notify vendor and user
        socket.to(`vendor_${vendorId}`).emit("delivery-accepted-by-partner", { orderId, deliveryPartnerId });
        socket.to(`user_${userId}`).emit("delivery-partner-assigned", { orderId, deliveryPartnerId });

        console.log(`Delivery accepted for ${orderId} by ${deliveryPartnerId}`);
      } catch (err) {
        console.error("Failed to update order:", err.message);
      }
    });



    socket.on("delivery-completed", async ({ orderId, userId, vendorId }) => {
      try {
        // Update order status to completed in your main backend
        // await axios.post("https://your-backend.com/api/orders/complete-delivery", {
        //   orderId,
        // });

        // Notify both user and vendor via Socket
        socket.to(`user_${userId}`).emit("delivery-completed-update", { orderId });
        socket.to(`vendor_${vendorId}`).emit("delivery-completed-update", { orderId });

        console.log(`Delivery completed for order ${orderId}`);
      } catch (error) {
        console.error("Error completing delivery:", error.message);
      }
    });

    

  }
  
  module.exports = { registerDeliveryHandlers };
  



  

    // socket.on("delivery-request-accepted", async ({ orderId, vendorId, userId }) => {
    //   const deliveryPartnerId = socket.user?.id;
  
    //   // TODO: Update DB with accepted delivery partner
    //   // await Order.findByIdAndUpdate(orderId, { deliveryPartner: deliveryPartnerId });
  
    //   // 🔁 Notify Vendor
    //   const vendorRoom = `vendor_${vendorId}`;
    //   socket.to(vendorRoom).emit("delivery-accepted-by-partner", {
    //     orderId,
    //     deliveryPartnerId,
    //   });
  
    //   // 🔁 Notify User
    //   const userRoom = `user_${userId}`;
    //   socket.to(userRoom).emit("delivery-partner-assigned", {
    //     orderId,
    //     deliveryPartnerId,
    //   });
  
    //   console.log(`Delivery request accepted for order ${orderId} by ${deliveryPartnerId}`);
    // });


        
  
    // Listen for delivery completion
    // socket.on("delivery-completed", ({ orderId, userId, vendorId }) => {
    //   const userRoom = `user_${userId}`;
    //   const vendorRoom = `vendor_${vendorId}`;
    
    //   // Notify both user and vendor
    //   socket.to(userRoom).emit("delivery-completed-update", { orderId });
    //   socket.to(vendorRoom).emit("delivery-completed-update", { orderId });
    
    //   console.log(`Delivery completed for order ${orderId}`);
    // });
