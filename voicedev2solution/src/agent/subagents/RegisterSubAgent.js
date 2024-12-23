import { isLoggedIn } from "../Util";
import AIEmoteType from '../../components/chat/messages/AIEmoteType.js';

const createRegisterSubAgent = (end) => {

    let stage;
    let username;
    let first_pin
    let second_pin

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return "You need to be logged out before registering."
        }
        else {
            stage = "FOLLOWUP_USERNAME"
            return "Got it! What username would you like to use?"
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME" : return await followupUsername(prompt);
            case "FOLLOWUP_PASSWORD" : return await followupPin(prompt);
            case "FOLLOWUP_PASSWORD_CONFIRM" : return await followupPinConfirm(prompt);
        }
        
    }

    const followupUsername = async(prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD"
        return {msg: "Thank you, what pin would you like to use? This must be 7 digits.", nextIsSensitive : "true"}
    }

    const followupPin = async(prompt) => {
        first_pin = prompt
        stage = "FOLLOWUP_PASSWORD_CONFIRM"
        return {msg: "Finally, please confirm your pin.", nextIsSensitive : "true"}

    }

    const followupPinConfirm = async(prompt) => {
        second_pin = prompt
        if (first_pin != second_pin) {
            return end({msg: "Pins do not match, registration cancelled.", emote: AIEmoteType.ERROR})
        }

        const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_11d032654d3564ab66960ce4a44db4823a3ab620f9e3a4bc99831f5fcfdefe17",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username : username,
                pin : first_pin
            })
        })
        if (res.status === 409) {
            return end({msg: "Username has already been taken.", emote: AIEmoteType.ERROR})
        } 
        else if(res.status === 200){
            return end({msg: `Success! Welcome to BadgerChat, ${username}.`, emote: AIEmoteType.SUCCESS})
                
        } 
        else {
            return end({msg: "Unknown error!", emote: AIEmoteType.ERROR});
        }     
    }


    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;