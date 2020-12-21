import * as Discord from "discord.js"
import { memoize } from "lodash";

const OVERLORD_ID:String = "187341089332658186";
const DISCORD_ADMINS = "201553609152921600";
const LOUIS = "789287064306450433";

export default class ControlManager {


    restrictedUsersId: String[] = [];
    AdminRoles: string[] = [DISCORD_ADMINS, LOUIS];

    //////////////////////////
    // COMMANDS //////////////

    checkForControlRelatedMessage = (message: Discord.Message) => {

        let isAllowed:boolean = false;

        message.member.roles.cache.forEach((role:Discord.Role) => {
            if(this.isUserAllowed(role.id)){
                isAllowed = true;
            }
        })

        // Special privilege
        if(message.member.id === OVERLORD_ID){
            isAllowed = true;
        }

        if(!isAllowed) return;

        let upperCaseMessage = message.content.toUpperCase();

        if(upperCaseMessage.startsWith("GIVE POWER TO")) this.addRoleToAdminRoles(message);

        if(upperCaseMessage.startsWith("TAKE POWER FROM")) this.removeRolesFromAdminsRoles(message);

        if(upperCaseMessage.startsWith("CEASE")) this.restrictAccess(message);

        if(upperCaseMessage.startsWith("RELEASE")) this.releaseAccess(message);

        switch(message.content.toUpperCase()){
            case "WHAT ARE THE ADMIN ROLES?":
                const answer = this.formatAdminRoles(this.getAdminRoleNames(message.guild, this.AdminRoles));
                message.channel.send(answer);
                break;
        }
    }

    restrictAccess = (message: Discord.Message) => {
        message.mentions.members.forEach((member: Discord.GuildMember) => {
            this.restrictedUsersId.push(member.id);
        });
    }

    releaseAccess = (message: Discord.Message) => {
        message.mentions.members.forEach((member: Discord.GuildMember) => {
            let index = this.restrictedUsersId.findIndex((id:String) => id === member.id);
            if(index !== -1){
                this.restrictedUsersId.splice(index);
            }
        });
    }

    addRoleToAdminRoles = (message: Discord.Message) => {
        const newRoles: String[] = this.getListOfRoles(message.content, 3, "+");

        message.guild.roles.cache.forEach((role:Discord.Role) => {
            if(newRoles.indexOf(role.name.toUpperCase()) !== -1){
                this.AdminRoles.push(role.id);
            }
        });

        const answer = this.formatAdminRoles(this.getAdminRoleNames(message.guild, this.AdminRoles));
        message.channel.send(answer);
    }

    removeRolesFromAdminsRoles = (message: Discord.Message) => {
        const rolesToDelete: String[] = this.getListOfRoles(message.content, 3, "+");
        
        message.guild.roles.cache.forEach((role:Discord.Role) => {
            if(rolesToDelete.indexOf(role.name.toUpperCase()) !== -1){
                this.AdminRoles.splice(this.AdminRoles.indexOf(role.id), 1)
            }
        });

        const answer = this.formatAdminRoles(this.getAdminRoleNames(message.guild, this.AdminRoles));
        message.channel.send(answer);
    }

    isUserAllowed = (roleId:string) => {
        return this.AdminRoles.findIndex((id:String) => id === roleId) !== -1
    }

    //////////////////////////
    // GETTERS //////////////

    isUserRestricted = (userId:String) => {
        return this.restrictedUsersId.findIndex((id:String) => id === userId) === -1
    }

    //////////////////////////
    // UTILS /////////////////

    getListOfRoles = (message:String, commandLength:number, separator:string): string[] => {
        const roles: string[] = message.split(separator);
        
        for(let i = 0; i < roles.length; i++){
            if(i == 0){
                roles[0] = roles[0].split(" ").slice(commandLength).join(" ");
            }
            roles[0] = roles[0].trim();
            roles[0] = roles[0].toUpperCase();
        }

        return roles;
    }

    formatAdminRoles = (roleNames:string[]): string => {
        let txt = "```list of admin Roles: ";

        for(let name of roleNames){
            txt += "\n- " + name;
        }

        txt += "```"

        return txt;
    }

    getAdminRoleNames = (guild:Discord.Guild, roleIds: string[]): string[] => {
        const roleNames:string[] = [];

        guild.roles.cache.forEach((role:Discord.Role) => {
            if(roleIds.indexOf(role.id) !== -1){
                roleNames.push(role.name);
            }
        });

        return roleNames;
    }
}