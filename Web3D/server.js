var shelljs = require('shelljs');
var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.sendFile(__dirname + '/hw4.html');
})

app.get('/api',function(req,res){
    
    let reqObj = req.query;
    shelljs.exec(`CircleRect.exe ${reqObj.circleR} ${reqObj.circleX} ${reqObj.circleY} ${reqObj.recWidth} ${reqObj.recHeight} ${reqObj.recPosX} ${reqObj.recPosY}`,function(status,output){
        res.write(output);
        res.end();
    });
})

app.listen(1337,function(){
    console.log('success listen');
});