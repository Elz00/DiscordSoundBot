// Import the discord.js module
import Discord = require("discord.js");



// Import the SoundManager
import { SoundManager } from './SoundPlayer/SoundManager';
import QuoteManager from "./QuoteManager/QuoteManager";
import AkkoManager from "./AkkoManager/AkkoManager";

require('dotenv').config();

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot started.');
});

var soundManager:SoundManager = new SoundManager();
var quoteManager:QuoteManager = new QuoteManager();
var akkoManager:AkkoManager = new AkkoManager();

client.on('message', message => {
    soundManager.checkForSoundRelatedMessage(message);
    quoteManager.checkForQuoteRelatedMessage(message);
    akkoManager.checkForAkkoRelatedMessage(message);
});

// Log our bot in
client.login(process.env.TOKEN);
