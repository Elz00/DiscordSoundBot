// Import the discord.js module
import * as Discord from "discord.js"
import Https = require("https");

import { Sound } from './Sound';

const fs = require('fs');

interface Playlist {
    sounds: Sound[];
    voiceConnection: Discord.VoiceConnection;
}

export class SoundManager {

    fredFilesMp3:Sound[] = [];
    fredFilesName:String[] = [];

    playlists:Map<string, Playlist> = new Map();

    commandChannels:String[] = ["452338796776652811"];

    constructor(){
        fs.readdir('./src/soundsMP3/', (err: any, files: any) => {
            files.forEach((file:any) => {
                const name = file.toUpperCase().substring(0, file.length - 4)
                this.fredFilesMp3.push(new Sound('./src/soundsMP3/' + name + ".mp3", name));
                this.fredFilesName.push(name);
            });
        })
    }

    //////////////////////////////////////
    // PLAY OR STOP SOUNDS ///////////////

    checkForSoundRelatedMessage = (message:Discord.Message) => {
        if(this.fredFilesName.indexOf(message.content.toUpperCase()) !== -1){
            this.addSoundToQueue(message);
        }

        if(message.content.toUpperCase().indexOf("REDUCE AUTISM") === 0){
            this.deleteSound(message);
        }

        switch (message.content.toUpperCase()) {
            case "ENHANCE AUTISM": 
                this.addSound(message);
                break;
            case "SHUT THE FUCK UP": 
                this.stopPlaylist(message);
                break;
            case "STFU": 
                this.stopPlaylist(message);
                break;
            case "REDUCE AUTISM": 
                this.deleteSound(message);
                break;
            case "AIDEZ MOI": 
                this.helpCommand(message);
                break;
            case "ADD THIS CHANNEL":
                this.commandChannels.push(message.channel.id);
                break;
        }
    }

    addSoundToQueue = (message:Discord.Message) => {
        if(this.isCommandValid(message)){
            let voiceChannel:Discord.VoiceChannel = message.member.voice.channel;
            if(voiceChannel != null){

                const sound:Sound = this.fredFilesMp3.find((sound:Sound) => sound.name === message.content.toUpperCase());

                // Create the playlist for this channel if it doesnt exist
                if(this.playlists.has(voiceChannel.id)){
                    this.playlists.get(voiceChannel.id).sounds.push(sound);
                } else {
                    this.playlists.set(voiceChannel.id, {sounds: [sound], voiceConnection: null} )
                }

                // If this is false, this means the bot is already playing the playlist
                // So we don't need to start it
                if(this.playlists.get(voiceChannel.id).sounds.length == 1){
                    this.playPlaylist(voiceChannel);
                }
            }
        }
    }

    playPlaylist = (channel:Discord.VoiceChannel) => {

        const soundList:Sound[] = this.playlists.get(channel.id).sounds;
        const sound:Sound = soundList[0]

        if(sound === undefined) return;

        // We create a new voiceConnection if the bot isn't in the channel
        if(this.playlists.get(channel.id).voiceConnection === null){
            channel.join().then((connection:Discord.VoiceConnection) => {
                this.playlists.get(channel.id).voiceConnection = connection;
            }).catch(console.error);
        }

        channel.join().then((connection:Discord.VoiceConnection) => {
            
            let dispatcher:Discord.StreamDispatcher = connection.play(sound.path.toString());

            dispatcher.on("finish", () => {
                setTimeout(() => {
                    soundList.shift()
                    if(soundList.length > 0){
                        this.playPlaylist(channel);
                    } else {
                        this.playlists.get(channel.id).voiceConnection.disconnect()
                        this.playlists.get(channel.id).voiceConnection = null;
                    }
                }, 1000);
            });

        }).catch(console.error);
    }

    stopPlaylist = (message:Discord.Message) => {
        const voiceChannel = message.member.voice.channel;
        if(voiceChannel != null){
            const playlist:Playlist = this.playlists.get(voiceChannel.id)
            if(playlist){
                playlist.sounds = [];
                playlist.voiceConnection.dispatcher.end()
            }
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
                    var fileUpload = fs.createWriteStream("./src/soundsMP3/" + file.name.toUpperCase().substring(0, file.name.length - 4) + ".mp3");
                    var request = Https.get(file.url, function(response) {
                        response.pipe(fileUpload);
                    });

                    // Add the name of the attachment to the list of playable sound
                    this.fredFilesMp3.push(new Sound('./src/soundsMP3/' + file.name.toUpperCase().substring(0, file.name.length - 4) + ".mp3", file.name.toUpperCase().substring(0, file.name.length - 4)));
                    this.fredFilesName.push(file.name.toUpperCase().substring(0, file.name.length - 4));
                }
            });
        }
    }

    deleteSound = (message:Discord.Message) => {
        var toDelete:String[] = message.content.split(" ");
        toDelete.splice(0, 2);
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

        const nameList:String[] = [];
        let i = 0;
        let letterCount = 0

        for(const name of this.fredFilesName){
            // 3 is for "\n- "
            letterCount += name.length + 3;

            if(letterCount > 1900){
                i++;
                letterCount = name.length;
            }

            nameList[i] += "\n- " + name
            
        }

        message.channel.send("Here is a list of all the sounds I can make");
        for(const names of nameList){
            message.channel.send("```" + names + "```");
        }
    }

    //////////////////////////////////////
    // UTILITY ///////////////////////////

    isCommandValid = (message:Discord.Message) => message.member.voice.channel.joinable && this.commandChannels.indexOf(message.channel.id) !== -1
}