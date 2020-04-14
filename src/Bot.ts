import SSnailClient from "./handler/SSnailClient";

const client = new SSnailClient({
    disableMentions: "everyone"
});

client.build();