<script >
  import { io } from "socket.io-client";
  const socket = io("http://127.0.0.1:3000/");

let adminresult = [];

socket.on("connect", () => {

  socket.on("getfirst",(data)=>{
    if(data){
      console.log(JSON.stringify(data))
      adminresult = data
    }
  })
   socket.on("hasilnya",(data)=>{
    if(data){
      console.log(JSON.stringify(data))
      adminresult = data.data
    }
  })
  console.log("svelte is connected"); // true
});

socket.on("disconnect", () => {
  console.log("svelte is DISKONEK !!!"); // true


});
async function deleteitem(id){
  socket.emit("deletesocket",{id:id})
}

async function edititem(p){

  let person = prompt(`change ${p.nama}`,p.nama)
  socket.emit("editsocket",{id:p.id,editdata:person})
}

let newinput = []
</script>
<div>
  new data :<input bind:value={newinput}
  on:keypress={(e)=>{
    if(e.charCode  === 13){
      socket.emit("addnewitem",{newinput})
    }
  }}
  />
  <br/>
  {#each adminresult as p}
  <div
  style="margin-bottom: 20px;"
  >
    <button
    style="background-color: blue;color: white;"
    on:click={edititem(p)}
    >edit</button>
    <li>{p.id} - {p.nama}</li>
    <button
     style="background-color: red;color: white;"
    on:click={deleteitem(p.id)}
    >delete</button>
    <br/>
  </div>

  {/each}

</div>