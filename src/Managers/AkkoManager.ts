import Discord = require("discord.js");
import { formatAsCodeBlock } from "../Utils/Format";

//const fs = require('fs');
import * as fs from 'fs';

interface Picture {
    path: string;
    name: string;
}

class AkkoManager {
    
    akkoFiles:Picture[];
    
    constructor(){
        this.initializeFileName();
    }

    checkForAkkoRelatedMessage = (message:Discord.Message) => {
        if(message.content.toUpperCase() === "!HELPAKKO"){
            this.printAkkoList(message);
        } else {
            this.akkoFiles.forEach((p:Picture) => {
                if(p.name === message.content.toUpperCase())
                    this.sendPicture(message, p);
            })
        }
        
    }

    sendPicture = (message:Discord.Message, picture:Picture) => {
        message.channel.send({files: [picture.path]}).catch(err => {
            console.log(err);
        })
    }

    printAkkoList = (message:Discord.Message) => {
        let text:string = "";

        this.akkoFiles.forEach((p:Picture) => {
            return text += p.name + "\n";
        });

        message.channel.send(formatAsCodeBlock(text));
    }

    initializeFileName = async () => {   
        this.akkoFiles = [];
        await fs.readdir('./src/Database/AkkoPictures/', (err, files) => {
            files.forEach(file => {
                this.akkoFiles.push(
                    {
                        path: "./src/Database/AkkoPictures/" + file,
                        name: file.toUpperCase().substring(0, file.length - 4),
                    }
                );
            });
        })
    }
}

export default AkkoManager;