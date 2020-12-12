
import Discord = require("discord.js");
import Quote from "./Quote";
import { formatAsCodeBlock } from "../Utils/Format";
const fs = require('fs');
const readline = require('readline');


const _ = require("lodash");

class QuoteManager {

    quotes:Quote[] = [];

    constructor() {
        this.readAllQuotesFromTextFile();
    }

    checkForQuoteRelatedMessage = (message:Discord.Message) => {

        switch (message.content.toUpperCase().split(" ")[0]) {
            case "!QUOTE": {
                this.printQuote(message);
                break;}
            case "!NEWQUOTE": {
                this.newQuote(message);
                break;}
            case "!QUOTEALL": {
                this.quoteAll(message);
                break;}
            case "!RANDOMQUOTE": {
                this.randomQuote(message);
                break;}
            case "!QUOTEEVOLUTION": {
                this.quoteEvolution(message);
                break;}
            case "!HELPQUOTES": {
                this.printHelpMessage(message);
                break;}
        }

    }

    printQuote = (message:Discord.Message) => {
        let messageAsArray:string[] = message.content.split(" ");
        
        if(messageAsArray.length >= 2) {
            let quote:Quote = this.quotes.find((q:Quote) => (
                q.id.toUpperCase() ===  messageAsArray[1].toUpperCase()
            ));

            if(quote !== undefined)
            quote.printQuote(message.channel);
        }
    }

    newQuote = (message:Discord.Message) => {
        let messageAsArray:string[] = message.content.split(" ");

        if(messageAsArray.length >= 4) {
            // [0] is !NewQuote
            // [1] the id of the quote
            // [2] the name of the person
            // [3] and onward is the quote

            let quoteName = messageAsArray[2];
            let quoteId = messageAsArray[1];

            let quote = messageAsArray.slice(3).reduce((quote:string, quotePart:string) => {
                return quote += " " + quotePart;
            })

            let newQuote:Quote = new Quote(quoteName, quote, quoteId);

            this.addToDataBase(newQuote).then(() => {
                this.quotes.push(newQuote);
            })
            
        }
    }

    quoteAll = (message:Discord.Message) => {
        let quoteMessage:string = "";

        let messageAsArray:string[] = message.content.split(" ");

        if(messageAsArray.length >= 2){
            // A name is specified
            let specifiedQuotes:Quote[] = this.quotes.filter((q:Quote) => q.name === messageAsArray[1].toUpperCase())
            
            specifiedQuotes.forEach((q:Quote) => {
                quoteMessage += q.getQuoteAsString() + "\n"
            });
        } else {
            // A name isn't specified
            this.quotes.forEach((q:Quote) => {
                quoteMessage += q.getQuoteAsString() + "\n"
            });
        }

        if(quoteMessage !== "")
            message.channel.send(formatAsCodeBlock(quoteMessage));
    }

    randomQuote = (message:Discord.Message) => {
        if(this.quotes.length !== 0)
            this.quotes[Math.floor(Math.random()*this.quotes.length)].printQuote(message.channel);
    }

    quoteEvolution = (message:Discord.Message) => {
        let messageAsArray:string[] = message.content.split(" ");

        if(messageAsArray.length >= 2) {
            let specificQuotes:Quote[] = this.quotes.filter((q:Quote) => {
                return q.name === messageAsArray[1].toUpperCase();
            });

            let quoteMessage = "";

            if (messageAsArray.length >= 3) {
                if(messageAsArray[2].toUpperCase() === "!ID") {
                    specificQuotes.forEach((q:Quote) => {
                        quoteMessage += q.getQuoteWithDateAsString() + " - Id: " + q.id +"\n";
                    })
                } else {
                    specificQuotes.forEach((q:Quote) => {
                        quoteMessage += q.getQuoteWithDateAsString() + "\n";
                    })
                }
            } else {
                specificQuotes.forEach((q:Quote) => {
                    quoteMessage += q.getQuoteWithDateAsString() + "\n";
                })
            }

            

            if (quoteMessage !== "")
                message.channel.send(formatAsCodeBlock(quoteMessage));
        } 
    }

    printHelpMessage = (message:Discord.Message) => {
        let helpMessage = `
!NewQuote <id> <name> <quote>: Creates a new Quote
    Id: the quote identifier (used in the !quote command)
    Name: Name of the person who said the quote (capital letters dont matter)
    Quote: The rest of the message is the quote
!Quote <id>: Prints the quote with the corresponding id
!QuoteAll <name>: Prints all the quote of someone or everyone if no name is specified
    Name: Add a name if you want all the quotes from a single person
!RandomQuote: Prints a random quote
!QuoteEvolution <name> [!ID]: Prints all the of someone in chronological order
    Name: name of the person
    !ID: If !ID if written after the name, the id of the quotes will be showed
         usefull if you have forgotten the id of a Quote`
        

        message.channel.send(formatAsCodeBlock(helpMessage));
    }

    //////////////////////////////////////
    // DATABASE UTILS ////////////////////

    readAllQuotesFromTextFile = async ():Promise<void> => {
        await fs.readFile("./src/DataBase/quotes.txt", "utf8", (errors:any, data:string) => {
            data.split("\n").forEach((qAsString:string) => {
                let qData:string[] = qAsString.split(";");
                this.quotes.push(new Quote(qData[0], qData[1], qData[2], new Date(qData[3])))
            })
        })
    }


    // How the fuck do I return True 
    addToDataBase = async (q:Quote):Promise<boolean> => {
        console.log(q.date);
        let data:string = "\n" + q.name + ";" + q.quote + ";" + q.id + ";" + q.date.toISOString();
        return fs.appendFile("./DataBase/quotes.txt", data, "utf8", (err:any) => {
            if(err !== null)
                console.log("Errors While adding a new Quote : " + err);
        })
    }
}

export default QuoteManager;