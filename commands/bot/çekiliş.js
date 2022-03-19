const Discord = require('discord.js');
const db = require('quick.db')
const ayarlar = require('../../config.json');
var prefix = ayarlar.prefix
exports.run = (client, msg, args) => {
  var x = 0
  var y = 0
  var z = 0
   msg.channel.send("Çekiliş başladı katılmak için çekilişekatıldım yazın")
  var liste = []
  client.on("message",msg =>{
    
    if(msg.content==="çekilişekatıldım"){
      var kisi = msg.author
      var n = liste.includes(kisi)
      if(n==true){
        if(z===0){

        }
      }
      else{
        liste.push(kisi);
      }
    }
    
  });
client.on("message",msg =>{
    if(msg.content==="çekilişekatılanlar"){
      
      if(y===0){
      msg.author.send(liste)
        y=y+1
        }
    }
  });
  client.on("message",msg =>{
    if(msg.content==="çekilişibitir"){
      
      const kazanan = liste[Math.floor(Math.random() * liste.length)]
      if(x===0){
      msg.channel.send("ÇEKİLİŞ BİTTİ KAZANAN ; "+kazanan)
        x=x+1
        }
    
    }
    
  });



  };
exports.conf = {
  enabled: true, 
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

let use = "çekiliş"

exports.help = {
  name: use,
  description: use,
  usage: use
};