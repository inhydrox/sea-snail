const client = new (require("./handler/SSnailClient"))({
    disableMentions: "everyone"
});
client.build();