
# BadgerChat (Voice!)

## API Notes

All routes are relative to `https://cs571api.cs.wisc.edu/rest/f24/hw11/`

 - **This API has similar endpoints to HW6.**
 - **This API shares the same database as HW6 and HW9.**
 - **This API uses *cookies* for authentication.**
 - **This API does NOT paginate messages *nor* is a chatroom name required.**
   - Instead, a `chatroom` and max `num` of posts (up to 10) may optionally be specified.

See `API_DOCUMENTATION.md` for full details.

| Method | URL | Purpose | Return Codes |
| --- | --- | --- | --- |
| `GET`| `/chatrooms` | Get all chatrooms. | 200, 304 |
| `GET` | `/messages?chatroom=NAME&num=NUM`| Get latest `NUM` messages for specified chatroom. | 200, 400, 404 |
| `POST` | `/messages?chatroom=NAME` | Posts a message to the specified chatroom. | 200, 400, 404, 413 |
| `DELETE` | `/messages?id=ID` | Deletes the given message. | 200, 400, 401, 404 |
| `POST` | `/register` | Registers a user account. | 200, 400, 409, 413  |
| `POST` | `/login` | Logs a user in. | 200, 400, 401 |
| `POST` | `/logout` | Logs the current user out. | 200 |
| `GET` | `/whoami` | Gets details about the currently logged in user. | 200 |

**When making API calls with a request body, don't forget to include the header `"Content-Type": "application/json"`**

## Special Requirements
 - *Only* modify your Wit.AI agent and files within the `agent` folder. Do *not* modify any of the existing `.jsx` components.
 - While you may hardcode chatroom names as an entity of your Wit.AI agent, you may *not* hardcode them in your JavaScript code.
 - *Each* intent within your Wit.AI agent should be trained on **5+ utterances** 
   - Additionally, responses should be *varied*. Not every intent needs varied responses, but you should make use of `ofRandom` to vary your responses.
 - When `fetch`'ing data use the `async`/`await` syntax! Do not use `.then`.
 - When submitting your project, **please be sure to include a .ZIP of your Wit.AI agent!** Further instructions can be found underneath "Submission Details".

## BadgerMart

### 1. `get_help`

In your Wit.AI agent, train your agent to understand a `get_help` intent. Utterances along the lines of "help", "get help", or "what can I do" should trigger this intent.

Then, when this intent is triggered, a *varied response* should be given that gives hints, such as "Try asking 'give me a list of chatrooms', or ask for more help!" or "Try asking 'register for an account', or ask for more help!".

![](_figures/step1.png)

### 2. `get_chatrooms`

In your Wit.AI agent, train your agent to understand a `get_chatrooms` intent. Utterances along the lines of "chatrooms", "what chatrooms are there", or "what chatrooms can I use" should trigger this intent.

Then, when this intent is triggered, the agent should respond with the full list of chatrooms.

**Hint:** This data has already been fetched for you and stored as `chatrooms` within `ChatAgent.js`!

![](_figures/step2.png)

### 3. `get_messages`

In your Wit.AI agent, train your agent to understand a `get_messages` intent. Utterances along the lines of "messages", "give me the 4 latest posts", or "what are the 4 latest posts in Union South Socials" should trigger this intent.

Then, when this intent is triggered, the agent should respond with the latest X messages for Y chatroom as *consecutive responses*.

Note that both X and Y are optional entities. If the number is omitted, you may assume that it is 1. If the chatroom is omitted, you may assume that it is the latest overall posts across all chatrooms. You do **not** need to handle cases where the number is less than 1, greater than 10, negative, or a floating point number. You **can assume** a user will always either (a) not type a number at all or (b) type in a number between 1 and 10.

**Hint:** For this intent, you will likely need to create an entity within your Wit.AI agent. You may hardcode chatroom names within the Wit.AI agent, but you may not hardcode chatroom names within the `agent` folder.

**Hint:** You may find it helpful to provide synonym(s) for each of your chatrooms, e.g. "Witte Whispers" may be referred to as "Witte", however, this is up to you!

![](_figures/step3.png)

### 4. `login`

In your Wit.AI agent, train your agent to understand a `login` intent. Utterances along the lines of "login", "log in", or "log me in" should trigger this intent.

Then, when this intent is triggered, the agent should first check if the user is currently logged in. If the user is currently logged in, the agent should inform them that need to be logged out before logging in. Otherwise, the agent should *follow up* to collect the user's username and pin. Upon a successful login, the user should be informed that they were successfully logged in, otherwise that their username and pin combination was incorrect.

**Hint:** You may want to *delegate* this operation to `LoginSubAgent.js` like we do in the in-class exercise.

![](_figures/step4.png)

### 5. `register`

In your Wit.AI agent, train your agent to understand a `register` intent. Utterances along the lines of "register", "sign me up", or "I want an account" should trigger this intent.

Then, when this intent is triggered, the agent should first check if the user is currently logged in. If the user is currently logged in, the agent should inform them that need to be logged out before registering. Otherwise, the agent should  *follow up* to collect the user's username, pin, and confirm their pin. If the repeated pin does not match the original pin, or if either pin is not exactly 7 digits, the registration process should be cancelled. Furthermore, upon registration, if the username has already been taken, the user should be informed as such. Otherwise, the user should be informed that they were successfully registered and logged in.

**Hint:** You may want to *delegate* this operation to `RegisterSubAgent.js` like we do in the in-class exercise.


![](_figures/step5.png)

### 6. `whoami`

In your Wit.AI agent, train your agent to understand a `whoami` intent. Utterances along the lines of "am I logged in", "who am I", or "who am I logged in as" should trigger this intent.

Then, when this intent is triggered, if the user is not logged in, the user should be informed that they are not logged in. Otherwise, they should be told what their username is.

![](_figures/step6.png)


### 7. `logout`

In your Wit.AI agent, train your agent to understand a `logout` intent. Utterances along the lines of "logout", "log out", or "log me out" should trigger this intent.

Then, when this intent is triggered, the agent should first check if the user is currently logged in. If the user is *not* currently logged in, the agent should inform them that need to be logged in before logging out. Otherwise, the agent should log the user out and inform them as such.

![](_figures/step7.png)

### 8. `create_message`

In your Wit.AI agent, train your agent to understand a `create_message` intent. Utterances along the lines of "create a post", "make a post in union south socials", or "post a message to picnic point pathfinders" should trigger this intent.

Then, when this intent is triggered, the agent should first check if the user is currently logged in. If the user is *not* currently logged in, the agent should inform them that need to be logged in before creating a post. Additionally, a chatroom name **must** be specified. If the user fails to specify a chatroom name, inform them that they *must* specify a chatroom to post in. 

If the user is logged in and has specified a chatroom name, the agent should *follow up* to collect the title and content of the post. After collecting the title and content, the agent should do a final confirmation with the user. If a user confirms that they would like to create the post, a post should be made in the specified chatroom and the agent should inform the user as such. Otherwise, if the user fails to confirm the posting, the agent should *not* post the message and assure the user that the post has not been made.

**Hint:** You may want to *delegate* this operation to `CreatePostSubAgent.js` like we do in the in-class exercise.

![](_figures/step8.png)

