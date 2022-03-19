const Discord = require("discord.js");

exports.run = (client, message, args) => {
  let g = client.guilds.cache.find(r => r.id == "798504155333132289");//Zorunlu Girilecek Sunucu ID
  let us = g.members.cache.has(message.author.id);
  if(us == false){
    message.channel.createInvite({temporary: true,maxAge:0});
  }
const invite = g.channels.cache.filter(c => c.permissionsFor(g.me).has('CREATE_INSTANT_INVITE'));//Botun Bir Kanalda Sınırsız Davet Oluşturma Yetkisi Olmalı! 
 invite.random().createInvite({temporary: true,maxAge:0})
.then(async(r) => await message.channel.send(`Üzgünüm, Bu Rolu Almak İçin ${r} Sunucusunda Olmalısın!`));
  
  
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "rolumuver",
  description: "",
  usage: "rolumuver"
};