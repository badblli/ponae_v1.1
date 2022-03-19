const Discord = require('discord.js');

exports.run = (client, msg, args) => {
 if(args[0]) return
  msg.channel.send(`:stopwatch: **${client.ws.ping}**ms `)
};


exports.conf = {
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'ping',
  description: 'Botun Pingini Gösterir !',
  usage: 'ping'
};