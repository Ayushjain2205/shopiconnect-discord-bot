require("dotenv").config();
const axios = require("axios");
const { Client, MessageEmbed } = require("discord.js");

const client = new Client();
const PREFFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in`);
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "shopiconnect") {
      message.channel.send({
        embed: {
          color: 3447003,
          author: {
            name: "ShopiConnect",
            icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
          },
          title: "Shopiconnect!",
          url: "http://google.com",
          description:
            "In these tough times when the world is being tested by this pandemic,Empower businesses near you!!\n\n Connect with small businesses near you or anywhere around the world!\n\n Currently available data in system: ```\nShops: 12 \nCategories: 3 \nCities: 3```",
          fields: [
            {
              name: "$categories",
              value: "Get all available shop/business categories.",
            },
            {
              name: "$cities",
              value: "Get cities of available shop/business.",
            },
            {
              name: "$shops !city <cityname>",
              value: "Get shops in the given city",
            },
            {
              name: "$shops !category <category name> !city <cityname>",
              value: "Get shops in the given city under given category\n",
            },
          ],
          footer: {
            icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
            text: "© Shopiconnect",
          },
        },
      });
    } else if (CMD_NAME === "categories") {
      const wait = async function () {
        const categories_obj = await getCategories();
        message.channel.send({
          embed: {
            color: 3447003,
            author: {
              name: "ShopiConnect",
              icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
            },
            title: "Shopiconnect!",
            url: "http://google.com",
            description:
              "Categories available on Shopiconnect curently are :\n",
            fields: categories_obj,
            footer: {
              icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
              text: "© Shopiconnect",
            },
          },
        });
      };
      wait();
    } else if (CMD_NAME === "cities") {
      const wait = async function () {
        const cities = await getCities();
        message.channel.send({
          embed: {
            color: 3447003,
            author: {
              name: "ShopiConnect",
              icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
            },
            title: "Shopiconnect!",
            url: "http://google.com",
            description: "Cities available on Shopiconnect curently are :\n",
            fields: cities,
            footer: {
              icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
              text: "© Shopiconnect",
            },
          },
        });
      };
      wait();
    } else if (CMD_NAME === "shops") {
      if (args[0] === "!city") {
        const wait = async function () {
          const cities = await getShopsCity(args[1]);
          message.channel.send({
            embed: {
              color: 3447003,
              author: {
                name: "ShopiConnect",
                icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
              },
              title: "Shopiconnect!",
              url: "http://google.com",
              description: "Shops according to given parameters are :\n",
              fields: cities,
              footer: {
                icon_url: "https://i.postimg.cc/k4S0cmnt/shopi.png",
                text: "© Shopiconnect",
              },
            },
          });
        };
        wait();
        //get by city
      } else if (args[0] === "!category") {
        if (args[2] === "!city") console.log("city and category");
      }
    }
  }
});

async function getShopsCity(city) {
  try {
    const response = await axios.get("http://localhost:1337/shops");
    const categories_obj = response.data.map((item) => {
      if (item.city === city) {
        return {
          name: "_____",
          value: ` [${item.name}](http://localhost:3000/shop/${item.id})`,
        };
      }
    });
    console.log(categories_obj);
    return categories_obj;
  } catch (error) {
    console.error(error);
  }
}

async function getCategories() {
  try {
    const response = await axios.get("http://localhost:1337/categories");
    const categories_obj = response.data.map((item) => {
      return { name: item.name, value: `Shops : ${item.shops.length}` };
    });
    return categories_obj;
  } catch (error) {
    console.error(error);
  }
}

async function getCities() {
  try {
    const response = await axios.get("http://localhost:1337/locations");
    const cities = response.data.map((item) => {
      return { name: item.city, value: " _ _ _ _ _ _" };
    });
    return cities;
  } catch (error) {
    console.error(error);
  }
}

client.login(process.env.DISCORDJS_BOT_TOKEN);
