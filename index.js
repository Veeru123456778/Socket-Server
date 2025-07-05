const express = require('express');
const jwt = require('jsonwebtoken');
const {Server} = require('socket.io');
const { createServer } = require("http");
const dotenv = require('dotenv');
const {registerDeliveryHandlers} = require('./events/delivery-partner');
const {registerVendorHandlers} = require('./events/vendor');
const {registerUserHandlers} = require('./events/user');

dotenv.config();

const app = express();

const httpServer = createServer(app);
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const io = new Server(httpServer, { 
    cors:{
        origin: "*", // Replace with your client URL
        methods: ["GET", "POST"],
        credentials: true
    }
});



io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    socket.user = user; // attach decoded user to socket
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});



io.on("connection", (socket) => {
  if (socket.user.role === 'DeliveryPartner') {
    registerDeliveryHandlers(socket);
  } else if (socket.user.role === 'vendor') {
    registerVendorHandlers(socket);
  } else {
    registerUserHandlers(socket);
  }  
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.user?.id}`);
  });
});



app.get('/', (req, res) => {    
    res.send('Server is running!');
});

httpServer.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});




// console.log("New client connected");
//   console.log("User ID:", socket.id);

//   socket.on("joinRoom", (workArea) => {
//       socket.join(workArea); // Join the specified room
//       console.log(`Client ${socket.id} joined room: ${workArea}`);
//   });


//   socket.on("delivery-request", (payload) => {
//     io.to(payload.workArea).emit("delivery-response", { message: `Delivery request from ${payload.workArea} and details are: ${payload.orderDetails}` });

//   });

//   socket.on("Message",(payload)=>{
//     console.log("Message from client:",payload);
//     io.to(payload.room).emit("Message", payload.message); // Broadcast the message to all other clients
//   });
  
  
//   socket.on("disconnect", () => {
//     console.log("Client disconnected: ",socket.id);
//   });