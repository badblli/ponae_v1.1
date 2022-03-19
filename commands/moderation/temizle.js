const Discord = require('discord.js')
const ayarlar = require('../../config.json')
let prefix = ayarlar.prefix

exports.run = async (client, message, args) => { 
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription(`Bu komutu kullanabilmek için **Mesajları Yönet** yetkisine sahip olmalısın!`));
  if (!args[0] || isNaN(args[0])) {
  const temizle = new Discord.MessageEmbed() 
  .addField("Hatalı Kullanım",`Örnek Kullanım: **${prefix}temizle 10**`)
  .setColor("RED")
  .setFooter("© ponæ 2021 BOT")
  return message.channel.send(temizle)
  }
  message.delete();
  let sayi = Number(args[0]);
  let silinen = 0;
  for (var i = 0; i < (Math.floor(sayi/100)); i++) {
  message.channel.bulkDelete(100).then(r => silinen+=r.size);
  sayi = sayi-100; 
  };
  if (sayi > 0)  message.channel.bulkDelete(sayi).then(r => silinen+=r.size);
  const sil = new Discord.MessageEmbed()  
  .setColor("GREEN")
  .addField("İşlem Başarılı",`**\`\`${args[0]}\`\` Adet Mesaj Silindi.**`)
  .setFooter("© ponæ 2021 BOT")
  .setImage("https://images-ext-1.discordapp.net/external/Bb032GyJs8yCJiUy7tWQ-YnNRPreLuPDo-xp66eOIeU/https/images-ext-2.discordapp.net/external/H1PQhcDr-EaEvwENT8cUxj8S2yonFZl351YbXXH5sGs/https/media.discordapp.net/attachments/697145772801785876/716671769355747348/1.gif")
  return message.channel.send(sil)
  }

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: ['temizle','clear','purge','delete'],
    permLevel: 3,
}

exports.help = {
    name: 'sil', 
    description: 'Mesajları Siler',
    usage: 'sil'
}

