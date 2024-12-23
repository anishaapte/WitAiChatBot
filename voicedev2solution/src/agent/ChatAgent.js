import createChatDelegator from "./ChatDelegator";
import { isLoggedIn, ofRandom } from "./Util"


const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "KADT4OSXJBFB3UMWHQ2E3HDEPW6SIQSH"; // Put your CLIENT access token here.

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleGetHelp = async () => {
       return ofRandom([
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!", 
            "Try asking 'tell me the 3 latest messages', or ask for more help!"
       ]);
    }

    const handleGetChatrooms = async () => {
        let chatroom_string = "Of course, there are " + chatrooms.length + " chatrooms: ";
        for (let i = 0; i < chatrooms.length - 1; i++) {
            chatroom_string += chatrooms[i] + ", "
        }
        chatroom_string += chatrooms[chatrooms.length - 1]
        return chatroom_string
    }

    const handleGetMessages = async (data) => {
        console.log(data);
        const hasNumber = data.entities["num_messages:num_messages"] ? true : false;
        const num_messages = hasNumber ? data.entities["num_messages:num_messages"][0].value : 1;
        
        const hasChatroom = data.entities["chatroom:chatroom"] ? true : false;
        const chatroom = hasChatroom ? data.entities["chatroom:chatroom"][0].value : ''

        const res = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroom}&num=${num_messages}`, {
            headers: {
                "X-CS571-ID": "bid_11d032654d3564ab66960ce4a44db4823a3ab620f9e3a4bc99831f5fcfdefe17"
            }
        });
        const messages = await res.json();
        return messages.messages.map(m => `In ${m.chatroom}, ${m.poster} created a post titled '${m.title}' saying '${m.content}'`);
    
    }

    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation("CREATE",data);
    }

    const handleLogout = async() => {
        if (!(await isLoggedIn())) {
            return "You need to be logged in before logging out."
        }
        else {
            const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": "bid_11d032654d3564ab66960ce4a44db4823a3ab620f9e3a4bc99831f5fcfdefe17"
                }
                });
                if(res.status === 200){
                    return "You have been logged out."
                } else {
                    return "Something else went wrong!"
                }
        }
    }

    const handleWhoAmI = async () => {
        const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/whoami", {
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_11d032654d3564ab66960ce4a44db4823a3ab620f9e3a4bc99831f5fcfdefe17"
            }
        });
        const status = await res.json();
        if(status.isLoggedIn){
            return `You are currently logged in as ${status.user.username}`
        } 
        else {
            return "You are not logged in."
        }

    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;