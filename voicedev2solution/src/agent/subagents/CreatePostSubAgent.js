import { isLoggedIn} from "../Util.js"
import AIEmoteType from '../../components/chat/messages/AIEmoteType.js';

const createPostSubAgent = (end) => {

    let stage;
    let title;
    let content;
    let chatroom;

    const handleInitialize = async (promptData) => {
        console.log(promptData)
        const chatroomExist = promptData.entities["chatroom:chatroom"] ? true : false;
        if(!(await isLoggedIn())){
            return end("You need to be logged in before creating a post.")
        }
        else if(!chatroomExist) {
            return end("You MUST specify a chatroom to post in.")
        }
        else {
            stage = "FOLLOWUP_TITLE"
            chatroom = promptData.entities["chatroom:chatroom"][0].value
            return "Great! What should the title of your post?"
        } 
    }

    const handleReceive = async (prompt) => {
        switch(stage){
            case "FOLLOWUP_TITLE" : return await followupTitle(prompt);
            case "FOLLOWUP_CONTENT" : return await followupContent(prompt);
            case "FOLLOWUP_CONFIRM" : return await followupConfirm(prompt);
        }
    }

    const followupTitle = async(prompt) => {
        title = prompt;
        stage = "FOLLOWUP_CONTENT"
        return "Alright, and what should be the content of your post?"
    }

    const followupContent = async(prompt) => {
        content = prompt
        stage = "FOLLOWUP_CONFIRM"
        return "Excellent! To confirm, you want to create this post titled " + title + " in " + chatroom
    }

    const followupConfirm = async(prompt) => {
        if (prompt.toLowerCase() === "yes") {
            const res = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroom}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": "bid_11d032654d3564ab66960ce4a44db4823a3ab620f9e3a4bc99831f5fcfdefe17",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title : title,
                    content : content
                })
            })
             if (res.status === 200) {
                return end({msg: "All set! Your post has been made in " + chatroom, emote: AIEmoteType.SUCCESS})
            } 
            else {
                return end({msg: "Unknown error. Post failed", emote: AIEmoteType.ERROR})
            }      

        } 
        else {
            return end({msg: "No problem, if you change your mind just ask me to create a post again!", emote: AIEmoteType.ERROR}) 
        }
    }
    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;