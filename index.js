const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("./database/database");
const usersDB = require("./database/users");

const prefix = ".";
var color = "GREEN";

var disabled = [];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    setTimeout(() => {
      client.user.setActivity(`👉 ${prefix}help`, { type: "WATCHING" });
    }, 10000);
    setTimeout(() => {
      client.user.setActivity(
        `Active on ${client.guilds.cache.size + 29} servers`,
        {
          type: "WATCHING",
        }
      );
    }, 10000);
    setTimeout(() => {
      client.user.setActivity(`Now English version!`, { type: "PLAYING" });
    }, 10000);
  }, 10000);

  db.authenticate()
    .then(() => {
      console.log("Logged in to DB!");
      usersDB.init(db);
      usersDB.sync();
    })
    .catch((err) => console.log(err));
});

client.on("message", async (message) => {
  if (disabled.includes(message.guild.id)) {
    if (message.content != `${prefix}enable`) {
      return 0;
    }
  }

  function time() {
    var today = new Date();
    var mounth = today.getMonth() + 1;
    if (mounth < 10) {
      mounth = `0${mounth}`;
    }

    return `${today.getFullYear()}-${mounth}-${today.getDate()}T${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  }
  if (message.author.id == "802216586605625384") {
    return 0;
  }

  if (
    message.channel.name.includes("opinions") ||
    message.channel.name.includes("opinie")
  ) {
    message.delete();
    message.channel.send({
      embed: {
        title: `New opinion from ${message.author.username}`,
        color: "YELLOW",
        description: message.content,
        footer: {
          timestamp: time(),
        },
      },
    });
  }

  if (message.channel.name.includes("partner")) {
    if (message.channel.parent) {
      if (message.channel.parent.id == "819865106951307294") {
        return 0;
      }
    }
    message.delete();
    message.channel.send({
      embed: {
        title: `New Partner ${message.guild.name}`,
        color: "GREEN",
        description: message.content,
        footer: {
          icon_url:
            "https://cdn.discordapp.com/avatars/" +
            message.author.id +
            "/" +
            message.author.avatar +
            ".png",
          text: `Realised by ${message.author.tag}`,
        },
      },
    });
  }

  if (
    message.channel.name.includes("propozycj") ||
    message.channel.name.includes("pomysł") ||
    message.channel.name.includes("proposition") ||
    message.channel.name.includes("ideas")
  ) {
    message.delete();
    message.channel
      .send({
        embed: {
          title: `New idea created by ${message.author.username}`,
          color: "BLUE",
          description: message.content,
          footer: {
            icon_url:
              "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/db/db52d4fe5c6b2b7b55b693dd189ad3b435d8bdc0_full.jpg",
            text: "Created by Emsa001#0747",
            timestamp: time(),
          },
        },
      })
      .then((message) => {
        message.react("👍");
        message.react("👎");
      });
  }
  const findUser = await usersDB.count({
    where: {
      userID: message.author.id,
      guildID: message.guild.id,
    },
  });
  if (findUser != 0) {
    async function a(user) {
      const authorusr = await usersDB.findOne({
        where: {
          userID: user.id,
        },
      });
      if (message.content.toLocaleLowerCase() == "cancel") {
        return usersDB
          .destroy({
            where: {
              userID: message.author.id,
              guildID: message.guild.id,
            },
          })
          .then(
            function (rowDeleted) {
              if (rowDeleted === 1) {
                message.channel.send({
                  embed: {
                    title: `✅ You canceled the announcement`,
                    color: "ORANGE",
                  },
                });
              }
            },
            function (err) {
              console.log(err);
            }
          );
      }
      if (authorusr.content != "") {
        var annchannel = message.content.replace(/[^0-9]/g, "");
        if (message.guild.channels.cache.get(annchannel) === undefined) {
          return message.channel.send({
            embed: {
              title: `❌ There is no such a text-channel`,
              color: "RED",
            },
          });
        }
        message.channel.send({
          embed: {
            title: `✅ Announce has been created succesfully!`,
            color: "GREEN",
          },
        });
        client.channels.cache.get(annchannel).send({
          embed: {
            title: authorusr.title,
            description: authorusr.content,
            color: color,
            timestamp: time(),
            footer: {
              icon_url:
                "https://cdn.discordapp.com/avatars/" +
                message.author.id +
                "/" +
                message.author.avatar +
                ".png",
              text: `Od ${message.author.tag}`,
            },
          },
        });
        return usersDB
          .destroy({
            where: {
              userID: message.author.id,
              guildID: message.guild.id,
            },
          })
          .then(
            function (rowDeleted) {
              if (rowDeleted === 1) {
                color = "GREEN";
              }
            },
            function (err) {
              console.log(err);
            }
          );
      }
      if (authorusr.title != "") {
        authorusr.content = message.content;
        message.channel.send({
          embed: {
            title: `✅ The content has been set!`,
            color: "GREEN",
            description:
              "◾️ Please tag a text-channel for you announcement ◾️",
          },
        });
      } else {
        authorusr.title = message.content;
        message.channel
          .send({
            embed: {
              title: `✅ The title has been set!`,
              color: "GREEN",
              description:
                "◾️ Please enter the content of an announcement ◾️",
            },
          })
          .then((message) => {
            message.react("🟢").catch((err) => console.error);
            message.react("🔵").catch((err) => console.error);
            message.react("🟡").catch((err) => console.error);
            message.react("🟠").catch((err) => console.error);
            message.react("🔴").catch((err) => console.error);
            message.react("🟣").catch((err) => console.error);
            var x = message.id;

            const filter = (r, u) =>
              r.emoji.name == "🟢" ||
              r.emoji.name == "🔵" ||
              r.emoji.name == "🟡" ||
              r.emoji.name == "🟠" ||
              r.emoji.name == "🔴" ||
              r.emoji.name == "🟣";
            const collector = message.createReactionCollector(filter, {
              time: 60000,
            });
            collector.on("collect", (r, u) => {
              if (u.id != "802216586605625384") {
                switch (r.emoji.name) {
                  case "🔵":
                    color = "BLUE";
                    break;
                  case "🟡":
                    color = "YELLOW";
                    break;
                  case "🟠":
                    color = "ORANGE";
                    break;
                  case "🔴":
                    color = "RED";
                    break;
                  case "🟣":
                    color = "PURPLE";
                    break;
                }
                message.channel.send(`You set the color ${color}`);
              }
            });
          });
      }
      await authorusr.save();
    }
    a(message.author);
  } else {
    console.log(findUser);
  }

  const commandBody = message.content.slice(prefix.length).trim();
  const args = commandBody.split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;

  switch (commandName) {
    case "disable":
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel
          .send({
            embed: {
              title: `I am sorry 🥺`,
              description: "❌ I cannot accept that command fro you",
            },
          })
          .then(() => {
            message.delete({ timeout: 3000 });
          });
      }
      if (!disabled.includes(message.guild.id)) {
        disabled.push(message.guild.id);
        message.channel.send({
          embed: {
            title: `iBot has been disabled`,
            color: "RED",
          },
        });
      } else {
        message.channel.send({
          embed: {
            title: `iBot is active now`,
            color: "ORANGE",
          },
        });
      }
      break;
    case "enable":
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel
          .send({
            embed: {
              title: `I am sorry 🥺`,
              description: "❌ I cannot accept that command fro you",
            },
          })
          .then(() => {
            message.delete({ timeout: 3000 });
          });
      }
      if (disabled.includes(message.guild.id)) {
        var guildIndex = disabled.indexOf(message.guild.id);
        disabled.splice(guildIndex, 1);
        message.channel.send({
          embed: {
            title: `iBot is active now`,
            color: "ORANGE",
          },
        });
      } else {
        message.channel.send({
          embed: {
            title: `IBot is already active`,
            color: "ORANGE",
          },
        });
      }
      break;
    case "bc":
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel
          .send({
            embed: {
              title: `I am sorry 🥺`,
              description: "❌ I cannot accept that command fro you",
            },
          })
          .then(() => {
            message.delete({ timeout: 3000 });
          });
      }
      const findUser = await usersDB.count({
        where: {
          userID: message.author.id,
          guildID: message.guild.id,
        },
      });
      if (findUser == 0) {
        const user = await usersDB.create({
          userName: message.author.username,
          userID: message.author.id,
          guildID: message.guild.id,
          title: "",
          content: "",
        });
        console.log(`${user.guildID}`);
      }
      message.channel.send({
        embed: {
          title: `◾️ Please enter the title of the announcement ◾️`,
          description: "Type: **cancel**, to cancel",
          color: "GREEN",
        },
      });
      break;
    case "clear":
      if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel
          .send({
            embed: {
              title: `I am sorry 🥺`,
              description: "❌ I cannot accept that command fro you",
            },
          })
          .then(() => {
            message.delete({ timeout: 3000 });
          });
      }
      if (!args[0]) {
        args[0] = 10;
      }
      message.channel.bulkDelete(args[0]).then(() => {
        message.channel
          .send({
            embed: {
              title: `${args[0]} messages has been deleted...`,
              color: "BLUE",
            },
          })
          .then((message) => message.delete({ timeout: 3000 }));
      });
      break;
    case "help":
      message.channel.send({
        embed: {
          title: "Help",
          description: "",
          color: 13430061,
          footer: {
            icon_url:
              "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/db/db52d4fe5c6b2b7b55b693dd189ad3b435d8bdc0_full.jpg",
            text: "Created by Emsa001#0747",
          },
          thumbnail: {
            url: `${client.user.displayAvatarURL()}`,
          },
          author: {
            name: "iBOT",
            icon_url: `${client.user.displayAvatarURL()}`,
          },
          fields: [
            {
              name: `${prefix}clear`,
              value: "Delete specific amount of messages",
              inline: true,
            },
            {
              name: `${prefix}bc`,
              value: "Create an announcement",
              inline: true,
            },
            {
              name: "Opinions",
              value:
                "If you have **opinions** chat, iBot will automatically format sended messages there",
            },
            {
              name: "Propositions",
              value:
                "If you have **propositions** chat, iBot will automatically format sended messages there and react with 👍 👎 ",
            },
            {
              name: "Partnership",
              value:
                "If you have chat called **partnership**. iBot will automatically format messages sended messages there",
            },
            {
              name: "Disable / Enable the bot",
              value: `${prefix}disable / ${prefix}enable - Disable or Enable the bot`,
            },
          ],
        },
      });
      break;
  }
});

client.login("token");
