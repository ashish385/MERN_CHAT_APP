const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const colors = require('colors')
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
var cors = require("cors");
const path = require("path")

// import routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes");


const app = express();
connectDB();
dotenv.config();
const PORT = process.env.PORT || 8000;


app.use(express.json());  // to accept json  data
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


//  app.get("/", (req, res) => {
//    res.send("API is running..");
//  });




app.use('/api/user', userRoutes)
app.use('/api/chat',chatRoutes )
app.use('/api/message', messageRoutes);

// ---------------------------Deployment-------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// ---------------------------Deployment-------------------------------

app.use(notFound);
app.use(errorHandler);




const server = app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000   "
    }
});

io.on("connection", (socket) => {
    console.log(`connected to socket.io`.green);

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("userData",userData._id);
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("room",room);
      socket.emit("User Joined Room: " + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing',(room) => socket.in(room).emit('stop typing'))

    socket.on("new message", (newMessageRecived) => {
        var chat = newMessageRecived.chat;
        console.log("chat",chat);
        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach(user => {
            if (user._id === newMessageRecived.sender._id) return
            
            socket.in(user._id).emit("message recived",newMessageRecived)
        });
    })

    socket.off('setup', () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
})