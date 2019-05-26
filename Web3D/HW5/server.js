var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port,() => {
    console.log('listening port %d',port);
});

app.use(express.static(__dirname));

var numUser = 0;
var CarData = [];

io.on('connection', (socket) => {
    console.log('new client');

    let nowData = {
        ID: numUser,
        pos: {x: 80, y: 0, z: 0},
        rot: Math.PI / 2
    };
    CarData.push(nowData);
    numUser++;

    socket.on('init',(data,fn) => {
        fn({
            CarData: CarData,
            numUser: numUser,
            ID : numUser - 1
        });
    });

    socket.broadcast.emit('new_user',nowData);

    socket.on('update',(data,fn) => {
        CarData[data.ID].pos.x = data.pos.x;
        CarData[data.ID].pos.y = data.pos.y;
        CarData[data.ID].pos.z = data.pos.z;
        CarData[data.ID].rot = data.rot;

        fn(CarData);
    })
});