import { Event } from "@type/index";
import SSnailClient from "../handler/SSnailClient";

class ReadyEvent implements Event {
    name = "ready";

    exec(client: SSnailClient) {
        console.log(`Logged in as ${client.user?.tag}.`);
    }
}

export default ReadyEvent;