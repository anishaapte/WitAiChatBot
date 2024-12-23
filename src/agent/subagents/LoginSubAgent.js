import { isLoggedIn } from "../Util";
import AIEmoteType from '../../components/chat/messages/AIEmoteType.js';


const createLoginSubAgent = (end) => {

    let stage;
    let username;
    let pin;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end("You are already logged in, try logging out first.")
        }
        else {
            stage = "FOLLOWUP_USERNAME" 
            return "Got it! What is your username?"
        }    
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME" : return await followupUsername(prompt);
            case "FOLLOWUP_PASSWORD" : return await followupPassword(prompt);
        }
        
    }

    const followupUsername = async(prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD"
        return {msg: "Got it! What is your pin?", nextIsSensitive : "true"}
    }

    const followupPassword = async(prompt) => {
        pin = prompt
        const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_11d032654d3564ab66960ce4a44db4823a3ab620f9e3a4bc99831f5fcfdefe17",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            })
        })
        if (res.status == 200) {
            return end({msg:"Logged in! Welcome " + username + ".", emote: AIEmoteType.SUCCESS})
        }
        else {
            return end({msg: "Sorry your username or pin is incorrect", emote: AIEmoteType.ERROR})
        }

    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;