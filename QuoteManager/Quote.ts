
import Discord = require("discord.js");
import { putFirstLetterToUpperCase } from "../Utils/Format"

class Quote {

    name:string;
    quote:string;
    id:string;
    date:Date;

    constructor(name:string, quote:string, id:string){
        this.name = name.toUpperCase();
        this.quote = quote;
        this.id = id;
        this.date = new Date();
    }

    printQuote = (channel:Discord.TextChannel | Discord.GroupDMChannel | Discord.DMChannel) => channel.send(this.getQuoteAsString())
    
    printQuoteWithDate = (channel:Discord.TextChannel | Discord.GroupDMChannel | Discord.DMChannel) => channel.send(this.getQuoteWithDateAsString())

    getQuoteAsString = ():string => putFirstLetterToUpperCase(this.name.toLowerCase()) + ": " + this.quote;

    getQuoteWithDateAsString = ():string => this.date.toLocaleString() + ", " + putFirstLetterToUpperCase(this.name.toLowerCase()) + " said : " + this.quote
    
}

export default Quote;