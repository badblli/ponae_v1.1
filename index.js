const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const config = require("./config.json");
const { prefix, official_akihiraeth } = require("./config.json");
const { Constants } = require('discord.js');
Constants.DefaultOptions.ws.properties.$browser = `Discord Android`
const AsciiTable = require('ascii-table');
const fs = require("fs");
const db = require("quick.db")
require('./events/eventHandler.js')(client);

/////TABLES
var commandtable = new AsciiTable('Akihiraeth Command Table');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


commandtable.setHeading("Command", 'Status', "Aliases")
fs.readdirSync('./commands').forEach(dir => {
const commandFiles = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const komutcuklar = require(`./commands/${dir}/${file}`);
  if (komutcuklar.help.name) {
  client.commands.set(komutcuklar.help.name, komutcuklar);
  commandtable.addRow(komutcuklar.help.name, "✔️", komutcuklar.conf.aliases)
} else {
  commandtable.addRow(komutcuklar.help.name, "❌")
  continue;
    }
    komutcuklar.conf.aliases.forEach(alias => {
      client.aliases.set(alias, komutcuklar.help.name);
    });
  }
})
console.log(commandtable.toString())

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === official_akihiraeth) permlvl = 4;
  return permlvl;
};


//SA-AS
client.on('message', async (msg, member, guild) => {
  let i = await  db.fetch(`saas_${msg.guild.id}`)
      if(i === 'açık') {
        if (msg.content.toLowerCase() === 'sa'){
       await msg.react('🇦'),
        msg.react('🇸')

      }
      }
    });

  
  
//SES
client.on("ready", () => {
  client.channels.cache.get("801844924315467806").join();   
}) 

//AFK
//client.on("message", async message => {
  //let afk = db.fetch(`afkSebep_${message.author.id}_${message.guild.id}`)
  //if ('<afk') return;
  //let username = db.fetch(`afkAd_${message.author.id}_${message.guild.id}`)
 // message.member.setNickname(username)
 // db.delete(`afkSebep_${message.author.id}_${message.guild.id}`)
 // db.delete(`afkAd_${message.author.id}_${message.guild.id}`)
  //db.delete(`afkid_${message.author.id}_${message.guild.id}`)
  //message.channel.send(`${messsage.author} artık AFK değil.`)
  //})

//AUTO ROLE

client.on("guildMemberAdd", member => {
  let rol = db.fetch(`autoRole_${member.guild.id}`);
if (!rol) return;
  let kanal = db.fetch(`autoRoleChannel_${member.guild.id}`);
  if (!kanal) return;

  member.roles.add(member.guild.roles.cache.get(rol));
  let embed = new Discord.MessageEmbed()
    .setDescription(
      "> :loudspeaker:  **Sunucuya yeni katılan** **" +
        member.user.username +
        "** **Kullanıcısına** <@&" +
        rol +
"> **Rolü verildi** :white_check_mark: "
    )
    .setColor("RANDOM") 
  member.guild.channels.cache.get(kanal).send(embed);
});


//BOOSTER ROLE

const logs = require('discord-logs');
logs(client);
client.on('guildMemberBoost', member => {
let guild = member.guild;
if(member.user.bot) return;
let rol = guild.roles.cache.get('799246274310176770')
guild.members.cache.get(member.user.id).roles.add(rol.id);
});

//BOOSTER INFO
const logstr = require('discord-logs');
logs(client);

client.on('guildMemberBoost', (member) => {
let kanal = client.channels.cache.get('800363547921743873');
kanal.send(`${member.user.tag} kullanıcısı ${member.guild.name} sunucusuna boost bastı!`);
member.send(`${member.guild.name} sunucusuna boost bastığın için teşekkürler!`);
});



//SAYAÇ

client.on("message", async message => {
  if (!message.guild) return;

  if (db.has(`sayac_${message.guild.id}`) === true) {
    if (db.fetch(`sayac_${message.guild.id}`) <= message.guild.members.cache.size) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Tebrikler ${message.guild.name}!`)
        .setDescription(`Başarıyla \`${db.fetch(`sayac_${message.guild.id}`)}\` kullanıcıya ulaştık! Sayaç sıfırlandı!`)
        .setColor("RANDOM");
      message.channel.send(embed);
      message.guild.owner.send(embed);
      db.delete(`sayac_${message.guild.id}`);
    }
  }
});
client.on("guildMemberRemove", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});
client.on("guildMemberAdd", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`**${member.user.tag}** Sunucuya Katıldı :tada:! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});




 //SUNUCU ADI SAYACI
 client.on("guildMemberAdd", (member) => {
  try {
  member.guild.setName(`🔗 Æ- Code&Plugins #J4J 〔${member.guild.memberCount} Kişi〕`);
  }
  catch (e) {
  console.log(e);
  }
  });
  
  client.on("guildMemberRemove", (member) => {
  try {
  member.guild.setName(`🔗 Æ- Code&Plugins #J4J 〔${member.guild.memberCount} Kişi〕`);
  }
  catch (e) {
  console.log(e);
  }
  });


//DESTEKÇİ

client.on("guildMemberRemove", async member => {
  if(member.guild.id !== "462008497588928528") return;//Zorunlu Girilecek Sunucu ID'Sİ
  let g = client.guilds.cache.find(r => r.id == "462008497588928528");//Rolun Verileceği Sunucu ID'Sİ
  let us = g.members.cache.find(r => r.id == member.user.id);
  us.roles.remove("804759880682569778");
});
  
client.on("guildMemberAdd", async member => {
  if(member.guild.id !== "462008497588928528") return;//Zorunlu Girilecek Sunucu ID'Sİ
  let g = client.guilds.cache.find(r => r.id == "ID");//Rolun Verileceği Sunucu ID'Sİ
  let us = g.members.cache.find(r => r.id == member.user.id);
  us.roles.add("804759880682569778");//Verilecek Rolun ID'Sİ
});

//bot yazıyo
client.on('ready', () => {
  client.channels.cache.get('804771486165762088').startTyping();
})

//MODLOG
const botadi = "ponÆ"

client.on('guildBanAdd', async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`)
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir kişi sunucudan yasaklandı")
    .setThumbnail(user.avatarURL()||user.defaultAvatarURL)
    .addField(`Yasaklanan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('guildBanRemove', async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`)
   const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir kişinin yasağı kaldırıldı")
     .setThumbnail(user.avatarURL()||user.defaultAvatarURL)
     .addField(`Yasağı kaldırılan kişi`, `\`\`\` ${user.tag} \`\`\` `)
     .setFooter(`${botadi} | Mod-Log Sistemi`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });


 client.on('channelCreate', async channel => {
  let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
   const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     if (channel.type === "text") {
       let embed = new Discord.MessageEmbed()
       .setColor("#fffa00")
       .setAuthor("Bir Kanal Oluşturuldu")
       .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
       .addField(`Oluşturulan Kanalın Türü : `, `Yazı`)
       .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
       .setFooter(`${botadi} | Mod-Log Sistemi`)
       .setTimestamp()
       modlogkanal.send(embed)
     }
       if (channel.type === "voice") {
       
         let embed = new Discord.MessageEmbed()
         .setColor("#fffa00")
         .setAuthor("Bir Kanal Oluşturuldu")
         .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
         .addField(`Oluşturulan Kanalın Türü : `, `Ses`)
         .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
         .setFooter(`${botadi} | Mod-Log Sistemi`)
         .setTimestamp()
         modlogkanal.send(embed)
 
 
     }
 }});

 client.on('channelDelete', async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first())
let user = client.users.cache.get(entry.executor.id)
let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
if(!modlogs) return;
if(modlogs) {
if (channel.type === "text") {
let embed = new Discord.MessageEmbed()
.setColor("#fffa00")
.setAuthor("Bir Kanal Silindi")
.addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
.addField(`Silinen Kanalın Türü : `, `Yazı`)
.addField(`Kanalı Silen : `, `<@${user.id}>`)
.setFooter(`${botadi} | Mod-Log Sistemi`)
.setTimestamp()
modlogkanal.send(embed)
}
  if (channel.type === "voice") {

    let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor("Bir Kanal Silindi")
    .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
    .addField(`Silinen Kanalın Türü : `, `Ses`)
    .addField(`Kanalı Silen : `, `<@${user.id}>`)
    .setFooter(`${botadi} | Mod-Log Sistemi`)
    .setTimestamp()
    modlogkanal.send(embed)
   }
  }
});

client.on('roleDelete', async role => {
  let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
   let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first())
   let user = client.users.cache.get(entry.executor.id)
  const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir Rol Silindi")
     .addField(`Silinen Rolün İsmi : `, `${role.name}`)
     .addField(`Rolü Silen : `, `<@${user.id}>`)
     .setFooter(`${botadi} | Mod-Log Sistemi`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });
 
 client.on('emojiDelete', async emoji => {
  let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
  let entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
   const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
   if(!modlogs) return;
   if(modlogs) {
     let embed = new Discord.MessageEmbed()
     .setColor("#fffa00")
     .setAuthor("Bir Emoji Silindi")
     .addField(`Silinen Emojinin İsmi : `, `${emoji.name}`)
     .addField(`Emojiyi Silen : `, `<@${user.id}>`)
     .setFooter(`${botadi} | Mod-Log Sistemi`)
     .setTimestamp()
     modlogkanal.send(embed)
   }
 });
  

 client.on('roleCreate', async role => {
  let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
  let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
  let user = client.users.cache.get(entry.executor.id)
    const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
    if(!modlogs) return;
    if(modlogs) {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Rol Oluşturuldu")
      .addField(`Oluşturulan Rolün İsmi : `, `${role.name}`)
      .addField(`Rolü Oluşturan : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
  });
  
  
  client.on('emojiCreate', async emoji => {
   let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
   let entry = await role.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first())
   let user = client.users.cache.get(entry.executor.id)
    const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
    if(!modlogs) return;
    if(modlogs) {
      let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Emoji Oluşturuldu")
      .addField(`Oluşturulan Emojinin İsmi : `, `${emoji.name}`)
      .addField(`Emoji Silen : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp()
      modlogkanal.send(embed)
    }
  });

//MESAJ LOG
client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type === "dm") return;
  if (newMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`modlogkanaly_${newMessage.guild.id}`);
  let scbul = newMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
    .addField("Kullanıcı", newMessage.author)
    .addField("Eski Mesaj", "```" + oldMessage.content + "```")
    .addField("Yeni Mesaj", "```" + newMessage.content + "```")
    .addField("Kanal Adı", newMessage.channel.name)
    .addField("Mesaj ID", newMessage.id)
    .addField("Kullanıcı ID", newMessage.author.id)
    .setFooter(`Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours() +
        3}:${newMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

client.on("messageDelete", async deletedMessage => {
  if (deletedMessage.author.botadi || deletedMessage.channel.type === "dm") return;
  if (deletedMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`modlogkanaly_${deletedMessage.guild.id}`);
  let scbul = deletedMessage.guild.channels.cache.get(sc)
  if(!scbul) {
    
  }
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL())
    .addField("Kullanıcı", deletedMessage.author)
    .addField("Silinen Mesaj", "```" + deletedMessage.content + "```")
    .addField("Kanal Adı", deletedMessage.channel.name)
    .addField("Mesaj ID", deletedMessage.id)
    .addField("Kullanıcı ID", deletedMessage.author.id)
    .setFooter(`Bilgilendirme  • bügün saat ${deletedMessage.createdAt.getHours() +
        3}:${deletedMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

// //KULLANICI KAYIT MESAJI\\

// client.on("guildMemberAdd", async member => {
//   let hgmesajı = db.fetch(`kgirismesajı_${member.guild.id}`)
//   client.channels.cache.get(hgmesajı).send(`Hoşgeldin ${member} Kayıt Olmak İçin !kayıt İsim Yaş`);
// });

// //KULLANICI KAYIT MESAJI SON\\


// //KULLANICI KAYIT MESAJI\\

// client.on("guildMemberAdd", async member => {
//   let yetkilihgmesajı = db.fetch(`yetkilikgirismesajı_${member.guild.id}`)
//   client.channels.cache.get(yetkilihgmesajı).send(`Hoşgeldin ${member} Kayıt Olmak İçin Kayıt Kanalına İsmini Yaz Ve Yetkilileri Bekle!`);
// });

// //KULLANICI KAYIT MESAJI SON\\

//   client.on("guildMemberAdd", member => { 
//   let kanal = db.fetch(`hgbbkanal_${member.guild.id}`)
//   let user = client.users.cache.get(member.id);
//   require("moment-duration-format");
//   const kurulus = new Date().getTime() - user.createdAt.getTime();  
//   const embed = new Discord.MessageEmbed()
//   var kontrol;
// if (kurulus < 1296000000) kontrol = ' **__Bu Hesap Güvenilir Değil__** '
// if (kurulus > 1296000000) kontrol = ' **__Bu Hesap Güvenilir Gözüküyor__** '
  
//   let codework = client.channels.cache.get(kanal);
// codework.send(`
// <806287721383329823> ** Hoşgeldin! ${member} Seninle Birlikte ${member.guild.memberCount} Kişiyiz. **

// <806287721383329823> ** Sunucuya Hoşgeldin Tagımızı Alarak Kayıt Olabilirsin. **

// <806287721383329823> ** <@802972871471136789> seninle ilgilenicektir. **

// <806287721383329823> ** Hesabın Oluşturulma Tarihi:** ${moment(member.user.createdAt).format(" **YYYY __DD MMMM dddd (hh:mm:ss) __ **")} **

// <806287721383329823> ** ${kontrol} **

// <806287721383329823> ** __ Register Odalara Girerek Kayıt Olman Lazım Dostum . __  `)
  
//   });

//REACTROLE
 //eğer en yukarıda client tanımlı ise bunu burdan kaldırıp yukarıya eklemelisin

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch(); 
  if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return; 
  if (!reaction.message.guild) return; 
  if (reaction.message.guild.id !== "798504155333132289") return; //Sunucu idnizi sola girin
  
  if (reaction.message.channel.id === "802944901590941716") { //Kanal idnizi sola girin
    if (reaction.emoji.name === "<:css3:798564981309177876>") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("806168619984748564") // İstediğiniz Rol idsini girin
      return user.send("CSS rolü başarıyla verildi!").catch(() => console.log("Dmden Mesaj Gönderemedim"));
    }
    
    if (reaction.emoji.name === "<:html5:798564980940996668>") {
      await reaction.message.guild.members.cache.get(user.id).roles.add("806168523256102963"); // İstediğiniz Rol idsini giriniz
      return user.send("HTML rolü başarıyla verildi!").catch(() => console.log("Dmden Mesaj Gönderemedim!"));
    }
    if (reaction.message.channel.id === "802944901590941716") { //Kanal idnizi sola girin
        if (reaction.emoji.name === "<:jsicon:798564981381660682>") {
          await reaction.message.guild.members.cache.get(user.id).roles.add("806168667401486376") // İstediğiniz Rol idsini girin
          return user.send("Javascript rolü başarıyla verildi!").catch(() => console.log("Dmden Mesaj Gönderemedim"));
        }
    }

    if (reaction.message.channel.id === "802944901590941716") { //Kanal idnizi sola girin
        if (reaction.emoji.name === "<:python:798565803540480020>") {
          await reaction.message.guild.members.cache.get(user.id).roles.add("806168796238839840") // İstediğiniz Rol idsini girin
          return user.send("Python rolü başarıyla verildi!").catch(() => console.log("Dmden Mesaj Gönderemedim"));
        }
    }

   

  } else {
    return; 
  }
})

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  
  if (user.bot) return;
  if (!reaction.message.guild) return;
  if (reaction.message.guild.id !== "798504155333132289") return; //sunucu idnizi giriniz
  
  if (reaction.message.channel.id === "802944901590941716") { //kanal idnizi giriniz
    if (reaction.emoji.name === "<:css3:798564981309177876>") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("806168619984748564")//yukarıda ayarladığınız 1.rol idsini giriniz
      return user.send("CSS rolü başarıyla kaldırıldı!").catch(() => console.log("Dmden Mesaj Gönderemedim."));
    }
    
    if (reaction.emoji.name === "<:html5:798564980940996668>") {
      await reaction.message.guild.members.cache.get(user.id).roles.remove("806168523256102963") //yukarıda ayarladığınız 2.rol idsini giriniz
      return user.send("HTML rolü başarıyla kaldırıldı!").catch(() => console.log("Dmden Mesaj Gönderemedim!"));
    }
    if (reaction.emoji.name === "<:jsicon:798564981381660682>") {
        await reaction.message.guild.members.cache.get(user.id).roles.remove("806168667401486376") //yukarıda ayarladığınız 2.rol idsini giriniz
        return user.send("Javascript rolü başarıyla kaldırıldı!").catch(() => console.log("Dmden Mesaj Gönderemedim!"));
      }

    if (reaction.emoji.name === "<:python:798565803540480020>") {
        await reaction.message.guild.members.cache.get(user.id).roles.remove("806168796238839840") //yukarıda ayarladığınız 2.rol idsini giriniz
        return user.send("Python rolü başarıyla kaldırıldı!").catch(() => console.log("Dmden Mesaj Gönderemedim!"));
      }
     
  } else {
    return;
  }
})

client.on('message', async message => {
  if (message.author.bot) return; 
  
  let pref = db.get(`prefix.${message.guild.id}`);
  let prefix;
  
  if (!pref) {
    prefix = "<"; //ayarladığınız komutu kullanabilmek için prefixinizi ayarlayabilirsiniz
  } else {
    prefix = pref;
  }
  
  if (!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  
  if (msg.startsWith(prefix + "emojirol")) { //solda ki rolü istediğiniz gibi ayarlayabilirsiniz gerekli ayarlamaları yaptıktan sonra sola ayarladığınız komutu kullanacaksınız
    let channel = client.channels.cache.get(""); 
    const embed = new Discord.MessageEmbed()
    .setColor(0xffffff)
    .setTitle("Emojilere tıklayarak sana uygun rolleri seç!")
    .setDescription(`»<:html5:798564980940996668> HTML hakkında yeterli bilgiye sahip olduğunu düşünüyorsan ya da HTML hakkında yardıma ihtiyacın varsa bu rolü almalısın! \n\n»<:css3:798564981309177876> CSS hakkında yeterli bilgiye sahip olduğunu düşünüyorsan ya da CSS hakkında yardıma ihtiyacın varsa bu rolü almalısın! \n\n»<:jsicon:798564981381660682> Javascript (node.js/discord.js) hakkında yeterli bilgiye sahip olduğunu düşünüyorsan ya da Javascript hakkında yardıma ihtiyacın varsa bu rolü almalısın! \n\n»<:python:798565803540480020> Python hakkında yeterli bilgiye sahip olduğunu düşünüyorsan ya da Python hakkında yardıma ihtiyacın varsa bu rolü almalısın!`) //emoji almak için herhangi bir kanala \:emojiadı: şeklinde yazıp alabilirsiniz
    .setFooter(`Bir hata olduğunu düşünüyorsan bize #istek-öneri-şikayet kanalından bildir!`)
    message.channel.send(embed).then(async msg => {
      await msg.react("<:html5:798564980940996668>");
      await msg.react("<:css3:798564981309177876>");
      await msg.react("<:jsicon:798564981381660682>");
      await msg.react("<:python:798565803540480020>");
    });
   };
});

client.login(config.token);