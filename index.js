/* @flow */
/*
FCHAT NODEJS CHAT APP
version:2
author: Bryan Snyder
basedon: Full Stack Ind Chat Project
lastupdate: 21060710
license: none
*/

//set the vars
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var nextId = 1;
var clients = {};

//start the chat
//setup echo server at the /public directory
app.ws('/fchat', function(ws,req){
  var clientId = nextId;
  clients[clientId] = { ws: ws};
  nextId++;
  ws.on('message', function(msgString){
    //parse the incoming string
    var inMsg = JSON.parse(msgString);
    var outMsg = JSON.stringify({
  //grab the JSON stuff
  clientId: clientId,
  message: inMsg.message
  }); //var outMsg strings the outgoing data for sending

  Object.keys(clients).forEach(function(clientId){
    clients[clientId].ws.send(outMsg, function (error){
      if (error !== undefined){
        console.warn('error', error);
        }
      });
    });
  //this peeps the clients we have and for each one
  //send on thier websocket and everyone gets messages
  });

  //remove clientId upon client exit
  //this must be placed inside app.ws
  ws.on('close', function close(){
    delete clients[clientId];
    });

});

//serve statics
app.use(express.static('public'));

//post the server is goo for you
app.listen(3000, function(){
  console.log('HEYNOW! We are live on port 3000!');
});
