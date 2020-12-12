import Discord = require("discord.js");
import Song from "./Song";

export class MuseManager {

    songs:Song[];

    constructor(){

    }

    checkForMuseRelatedCommands = (message:Discord.Message) => {

        switch (message.content.toUpperCase()) {
            case "!BOTPLAY": {
                this.playSong(message);
                break;}
            case "!MUSEADD": {
                this.addSong(message);
                break;}
            case "!MUSEREMOVE": {
                this.removeSong(message);
                break;}
            case "!MUSELIST": {
                this.listSongs(message);
                break;}
        }
    }

    playSong = (message:Discord.Message) => {
        if(message.content.split(" ").length === 2){
            
        } 
    }

    addSong = (message:Discord.Message) => {

    }

    removeSong = (message:Discord.Message) => {

    }

    listSongs = (message:Discord.Message) => {

    }
}