// Import the discord.js module
import Discord = require("discord.js");



// Import the SoundManager
import { SoundManager } from './Managers/SoundManager';
import AkkoManager from "./Managers/AkkoManager";
import ControlManager from "./Managers/ControlManager";

require('dotenv').config();

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot started.');
});

const controlManager: ControlManager = new ControlManager();
const soundManager:SoundManager = new SoundManager(controlManager);
const akkoManager:AkkoManager = new AkkoManager();

client.on('message', message => {
    soundManager.checkForSoundRelatedMessage(message);
    akkoManager.checkForAkkoRelatedMessage(message);
    controlManager.checkForControlRelatedMessage(message);
});

// Log our bot in
client.login(process.env.TOKEN);
