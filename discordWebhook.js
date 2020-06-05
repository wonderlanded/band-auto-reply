const Discord = require('discord.js');
const config = require('./config');
const webhook = new Discord.WebhookClient(config.webhook.id, config.webhook.secret)
module.exports = async(content) => {
    webhook.send(content)
} 