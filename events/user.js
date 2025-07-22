// events/user.js
const axios = require('axios');

function registerUserHandlers(socket) {
     
    socket.on("join-work-area", ({workArea,workCity}) => {
        const areaRoom = `user_${workCity}_${workArea}`;
        const personalRoom = `user_${socket.user.id}`;
      
        socket.join(areaRoom);       // for broadcast requests
        socket.join(personalRoom);   // for direct, personal updates
      
        console.log(`User joined area room: ${areaRoom}`);
        console.log(`User joined personal room: ${personalRoom}`);
      });
      

    // 📤 Event: User is searching for vendors
  socket.on("search-vendors", (payload) => {
    const { area, city } = payload;
    const vendorRoom = `vendor_${city}_${area}`;
    
    // Emit to all vendors in that area and should be handled in frontend
    socket.to(vendorRoom).emit("vendor-search-request", payload);
    

    console.log(`Search request sent to vendors in ${vendorRoom}`);
  });


  socket.on("track-order", (orderId,delivery_partner_id) => {
    socket.join(`delivery_partner_${delivery_partner_id}`);
    console.log(`User joined room for order ${orderId}`);
  });

  }
  
  module.exports = { registerUserHandlers };
  


  
  
      // const vendorRoom = `vendor_${workCity}_${workArea}`;

  // socket.to(vendorRoom).emit("vendor-search-request", {
    //   workArea,
    //   orderDetails,
    //   userId: socket.user?.id,
    // });
    
  // dummy order ready in user 
  
  // socket.on("order-ready", (orderPayload) => {
  //   const { workArea,workCity, orderId, orderDetails } = orderPayload;

  //   const targetRoom = `delivery_partner_${workCity}_${workArea}`;

  //   console.log(`Emitting delivery request to ${targetRoom}`);
  //   // Should be handled in frontend of delivery partner
  //   socket.to(targetRoom).emit("delivery-request", {
  //     orderId,
  //     orderDetails,
  //     fromVendor: socket.user?.id || "unknown", // if you use JWT
  //     time: new Date().toISOString()
  //   });
  // });