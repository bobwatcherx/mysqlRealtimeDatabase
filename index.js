const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {  
 cors: {
    origin: "*"
  }

 });

io.on("connection", async(socket) => {
 const connection = mysql.createConnection({
    host: '172.17.0.2',//CHANGE THIS
    user: 'root',
    password: 'admin123',
    database:"sekolahan"
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true
  });
await instance.start();

  instance.addTrigger({
    name: 'monitoring',
    expression: 'sekolahan.user',
    //sekolahan is database
    //user is table
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event) => { // You will receive the events here
      console.log(event);
       if(event){
        const sql = "select * from user"
        connection.query(sql,(err,result)=>{
          if(err) throw err;
          console.log(result)
          io.emit("hasilnya",{data:result})

        })
       } 
    },
  });


instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

  const sql = "select * from user"
        connection.query(sql,(err,result)=>{
          if(err) throw err;
          console.log(result);
        socket.emit("getfirst",result)

        })

      socket.on("deletesocket",(id)=>{
        const sql = `delete from user  where id='${id.id}'`
        connection.query(sql,(err,result)=>{
          if(err) throw err;
          console.log(result);
       

        })
      })

 socket.on("editsocket",(data)=>{
        const sql = `update user set nama='${data.editdata}'
        where id='${data.id}'`
        connection.query(sql,(err,result)=>{
          if(err) throw err;
          console.log(result);
       

        })
      })
socket.on("addnewitem",(newinput)=>{
const sql = `insert into user (nama)
  values('${newinput.newinput}')
`
console.log(newinput);
        connection.query(sql,(err,result)=>{
          if(err) throw err;
          console.log(result);
       

        })
      })
  console.log("user connected");
});

httpServer.listen(3000,()=>console.log("Server 3000"));