// Import the discord.js module
import Discord = require("discord.js");
import Https = require("https");

import { Sound } from './Sound';

const fs = require('fs');

export class SoundManager {

    fredFilesMp3:Sound[] = [];
    fredFilesName:String[] = [];

    channelPlaying:String[] = [];

    dontleave:Boolean = false;

    users:any[][];

    constructor(users:any[][]){
        this.users = users;
        fs.readdir('./soundsMP3/', (err, files) => {
            files.forEach(file => {
                this.fredFilesMp3.push(new Sound('./soundsMP3/' + file.toUpperCase().substring(0, file.length - 4) + ".mp3", file.toUpperCase().substring(0, file.length - 4)));
                this.fredFilesName.push(file.toUpperCase().substring(0, file.length - 4));
            });
        })
    }

    //////////////////////////////////////
    // PLAY OR STOP SOUNDS ///////////////

    checkForSoundRelatedMessage(message:Discord.Message){
        console.log(this.fredFilesName);
        if(this.fredFilesName.indexOf(message.content.toUpperCase()) !== -1){
            this.playSounds(message);
            console.log("test");
        }

        if(message.content.toUpperCase().indexOf("REDUCE AUTISM") === 0){
            this.deleteSound(message);
        }

        switch (message.content.toUpperCase()) {
            case "ENHANCE AUTISM": {
                this.addSound(message);
                break;}
            case "SHUT THE FUCK UP": {
                this.stopPlayingSound(message);
                break;}
            case "STFU": {
                this.stopPlayingSound(message);
                break;}
            case "REDUCE AUTISM": {
                this.deleteSound(message);
                break;}
            case "!HELP": {
                this.helpCommand(message);
                break;}
        }
    }

    playSounds(message:Discord.Message){
        
        /*let verif = true;

        for(var i = 0; i < this.users.length; i++){
            if(this.users[i][0] == message.author.id){
                verif = false;
            }
        }

        this.users.push([message.author.id, 3]);

        if(verif){
           
        setInterval(() => {
            if(users.length != 0){
                for(var i = 0; i < users.length; i++){
                    if(users[i][1] == 0){
                        users.splice(i);
                    } else {
                        users[i][1]--;
                    }
                }
            }
        }, 1000)

        }*/

        if(this.isInChannel(message) && message.channel.id == "452338796776652811"){
            console.log("isInChannel");
            let channel = message.member.voiceChannel;
    
            if(channel != null && this.channelPlaying.indexOf(channel.id) == -1){
                channel.join().then((connection) => {
            
                    this.channelPlaying.push(channel.id);

                    let sound:Sound = null;
    
                    this.fredFilesMp3.forEach(soundTemp => {
                        if(soundTemp.name === message.content.toUpperCase()){
                            sound = soundTemp;
                        }
                    });
            
                    let dispatcher:Discord.StreamDispatcher = connection.playFile(sound.path.toString());
        
                    dispatcher.on("end", end => {
                        setTimeout(() => {
                            channel.leave();
                        }, 1000);
                        this.dontleave = false;
                        this.channelPlaying.splice(this.channelPlaying.indexOf(channel.id), 1);
                    });
                });
            }

            
        }
    }

    stopPlayingSound(message:Discord.Message){
        if(message.member.voiceChannel != null && this.channelPlaying.indexOf(message.member.voiceChannel.id) != -1){
            message.member.voiceChannel.leave();
        }
    }

    //////////////////////////////////////
    // ADD OR DELETE SOUNDS //////////////

    addSound(message:Discord.Message){
        // Make sure at least 1 attachments
        if(message.attachments.size != 0){
            
            //foreach attachment, fetch data from discord and store it
            message.attachments.forEach((file) => {
                if(file.filename.endsWith(".mp3") || file.filename.endsWith(".MP3")){
                    var fileUpload = fs.createWriteStream("./soundsMP3/" + file.filename.toUpperCase().substring(0, file.filename.length - 4) + ".mp3");
                    var request = Https.get(file.url, function(response) {
                        response.pipe(fileUpload);
                    });

                    // Add the name of the attachment to the list of playable sound
                    this.fredFilesMp3.push(new Sound('./soundsMP3/' + file.filename.toUpperCase().substring(0, file.filename.length - 4) + ".mp3", file.filename.toUpperCase().substring(0, file.filename.length - 4)));
                    this.fredFilesName.push(file.filename.toUpperCase().substring(0, file.filename.length - 4));
                }
            });
        }
    }

    deleteSound(message:Discord.Message){
        var toDelete:String[] = message.content.split(" ");
        toDelete.splice(0, 2);
        var path = "";
        toDelete.forEach((element) => {

            let sound:Sound = null;
    
            this.fredFilesMp3.forEach(soundTemp => {
                if(soundTemp.name === element.toUpperCase()){
                    sound = soundTemp;
                }
            });

            if(fs.existsSync(sound.path)){
                fs.unlinkSync(sound.path);
            }

            this.fredFilesMp3.splice(this.fredFilesMp3.indexOf(sound), 1);
            this.fredFilesName.splice(this.fredFilesName.indexOf(element.toUpperCase()), 1);
        });
    }

    //////////////////////////////////////
    // HELP COMMANDS /////////////////////

    helpCommand(message:Discord.Message){
        var commands:string = "";
        var names = this.fredFilesName.sort((one, two) => (one > two ? 1 : -1));
        names.forEach(file => {
            commands += "- " + file + "\n"
        })
        message.channel.send("```Here is a list of all the sounds I can make:\n" + commands + "```");
    }

    //////////////////////////////////////
    // UTILITY ///////////////////////////

    isInChannel(message:Discord.Message){
        if(message.member.voiceChannel){
            return true;
        } else {
            return false;
        }
    }
}