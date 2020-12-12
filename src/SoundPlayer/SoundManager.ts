// Import the discord.js module
import * as Discord from "discord.js"
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
        fs.readdir('./src/soundsMP3/', (err: any, files: any) => {
            files.forEach((file:any) => {
                this.fredFilesMp3.push(new Sound('./src/soundsMP3/' + file.toUpperCase().substring(0, file.length - 4) + ".mp3", file.toUpperCase().substring(0, file.length - 4)));
                this.fredFilesName.push(file.toUpperCase().substring(0, file.length - 4));
            });
        })
    }

    //////////////////////////////////////
    // PLAY OR STOP SOUNDS ///////////////

    checkForSoundRelatedMessage = (message:Discord.Message) => {
        if(this.fredFilesName.indexOf(message.content.toUpperCase()) !== -1){
            this.playSounds(message);
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
            case "AIDEZ MOI": {
                this.helpCommand(message);
                break;}
        }
    }

    playSounds = (message:Discord.Message) => {
        if(this.isInChannel(message) && message.channel.id == "452338796776652811"){
            let channel:Discord.VoiceChannel = message.member.voice.channel;
            if(channel != null && this.channelPlaying.indexOf(channel.id) == -1){
                console.log("channel found: " + channel.name)
                channel.join().then((connection:Discord.VoiceConnection) => {
                    console.log("is in channel")
                    this.channelPlaying.push(channel.id);

                    let sound:Sound = null;
    
                    this.fredFilesMp3.forEach(soundTemp => {
                        if(soundTemp.name === message.content.toUpperCase()){
                            sound = soundTemp;
                        }
                    });
                    
                    let dispatcher:Discord.StreamDispatcher = connection.play(sound.path.toString());
        
                    dispatcher.on("finish", () => {
                        setTimeout(() => {
                            channel.leave();
                        }, 1000);
                        this.dontleave = false;
                        this.channelPlaying.splice(this.channelPlaying.indexOf(channel.id), 1);
                    });

                    
                }).catch(console.error);
            }

            
        }
    }

    stopPlayingSound = (message:Discord.Message) => {
        if(message.member.voice.channel != null && this.channelPlaying.indexOf(message.member.voice.channel.id) != -1){
            message.member.voice.channel.leave();
        }
    }

    //////////////////////////////////////
    // ADD OR DELETE SOUNDS //////////////

    addSound = (message:Discord.Message) => {
        // Make sure at least 1 attachments
        if(message.attachments.size != 0){
            
            //foreach attachment, fetch data from discord and store it
            message.attachments.forEach((file:Discord.MessageAttachment) => {
                if(file.name.endsWith(".mp3") || file.name.endsWith(".MP3")){
                    var fileUpload = fs.createWriteStream("./soundsMP3/" + file.name.toUpperCase().substring(0, file.name.length - 4) + ".mp3");
                    var request = Https.get(file.url, function(response) {
                        response.pipe(fileUpload);
                    });

                    // Add the name of the attachment to the list of playable sound
                    this.fredFilesMp3.push(new Sound('./soundsMP3/' + file.name.toUpperCase().substring(0, file.name.length - 4) + ".mp3", file.name.toUpperCase().substring(0, file.name.length - 4)));
                    this.fredFilesName.push(file.name.toUpperCase().substring(0, file.name.length - 4));
                }
            });
        }
    }

    deleteSound = (message:Discord.Message) => {
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

    helpCommand = (message:Discord.Message) => {
        var commands1:string = "";
        var commands2:string = "";
        var names = this.fredFilesName.sort((one, two) => (one > two ? 1 : -1));

        let halfIndex:number = names.length / 2;
        let lastNames = names.slice(halfIndex, names.length);
        names = names.slice(0, halfIndex);

        names.forEach(file => {
            commands1 += "- " + file + "\n"
        });
        lastNames.forEach(file => {
            commands2 += "- " + file + "\n"
        })
        message.channel.send("```Here is a list of all the sounds I can make:\n" + commands1 + "```");
        message.channel.send("```\n" + commands2 + "```");
    
    }

    //////////////////////////////////////
    // UTILITY ///////////////////////////

    isInChannel = (message:Discord.Message) => {
        if(message.member.voice.channel){
            return true;
        } else {
            return false;
        }
    }
}