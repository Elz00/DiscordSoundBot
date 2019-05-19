// Import the discord.js module
import Discord = require("discord.js");



// Import the SoundManager
import { SoundManager } from './SoundPlayer/SoundManager';
import QuoteManager from "./QuoteManager/QuoteManager";

require('dotenv').config();

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

var verif:boolean

const fs = require('fs');

var users:any[][] = [];

// Arrays of value thay can change if I desire
var unstoppableSounds = ["SOVIET_NATIONAL_ANTHEM_EAR_RAPE"];
var forbiddenWords = ["POUVOIR", "ABUS", "LIBERTÉ", "DICTATURE"];
var dontleave = false;

var soundManager:SoundManager = new SoundManager(users);
var quoteManager:QuoteManager = new QuoteManager();

client.on('message', message => {
    soundManager.checkForSoundRelatedMessage(message);
    quoteManager.checkForQuoteRelatedMessage(message);
});


function checkIfForbidden(message:Discord.Message):boolean{

    forbiddenWords.forEach(str => {
        if(message.content.toUpperCase().includes(str)){
            return true;
        }
    });

    return false;
}

// Log our bot in
//client.login("NDUyMjcyMTU0ODE0NDQ3NjE4.XOBiBw.s0EOMqQF63dHpr-ZQCukn0QzeBw");
client.login("NDQ3ODM5NjkwOTcyNzI1MjY4.XOCQzQ.MzDTpCRbjTn8BhnlNvvQ4-Uf61Y");