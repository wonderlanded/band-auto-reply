const Discord = require('discord.js');
const webhook = new Discord.WebhookClient('718384269986234450', 'yktSWTUEKSIWFzmQ-6602G1Sy5AS59pW34AytemTvBlWWQA-HOIHUJlL41-YOwzsbOUo')
module.exports = async(content) => {
    webhook.send(content)
} 