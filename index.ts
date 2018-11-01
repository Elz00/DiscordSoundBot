// Import the discord.js module
import Discord = require("discord.js");



// Import the SoundManager
import { SoundManager } from './SoundPlayer/SoundManager';

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

client.on('message', message => {

    ////////////////////////////////////////
    // MESSAGE UNIQUE TO SPECIFIC PEOPLE ///

    if(message.author.username == "OrignalQc"){
        if(checkIfForbidden(message)){
            var member = message.member
            // Kick
            member.kick().then((member) => {
                // Successmessage
                message.channel.send("Bye Justin");
            }).catch(() => {
                // Failmessage
                message.channel.send("Ca marche pas criss d'incompetent.");
            });
        }

    }
    
    ////////////////////////////////////////
    // SOUNDS RELATED COMMANDS /////////////

    soundManager.checkForSoundRelatedMessage(message);
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
client.login(process.env.TOKEN);
