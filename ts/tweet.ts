class Tweet {
    private text: string;
    time: Date;

    constructor(tweet_text: string, tweet_time: string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
    }

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source(): string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        // return "unknown";
        const t = this.text;

        if (t.includes("#RKLive") || t.startsWith("Watch my")) {
            return "live_event";
        }
        if (t.includes("I just set a goal") || t.startsWith("Achieved") || t.includes("#FitnessAlerts")) {
            return "achievement";
        }
        if (t.includes("Just completed a") || t.includes("Just posted a") || t.startsWith("Completed a") || t.startsWith("I just completed") || t.startsWith("I just ran with")) {
            return "completed_event";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written(): boolean {
        //TODO: identify whether the tweet is written
        return this.getUserWrittenText() != "";
    }

    get writtenText(): string {
        if (!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.getUserWrittenText();
    }

    get activityType(): string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        if (!(this.text.startsWith("Just completed a ") || this.text.startsWith("Just posted a"))) {
            return "unknown";
        }

        const words = this.text.split(" ");
        const unit = words[4];

        if (unit == "km" || unit == "mi") {
            return words[5]; // distance words
        }
        return words[3];; // no distance words
    }

    get distance(): number {
        if (this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        if (!(this.text.startsWith("Just completed a") || this.text.startsWith("Just posted a "))) {
            return 0;
        }

        const words = this.text.split(" ");
        const amount = parseFloat(words[3]); // cast string to float

        if (words[4] = "km") {
            return amount / 1.609
        }
        if (words[4] = "mi") {
            return amount;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber: number): string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }

    // tweet activity - new helper
    private getUserWrittenText(): string {
        if (this.source != 'completed_event') {
            return "";
        }
        const dashes = this.text.indexOf(" - ");
        if (dashes == -1) {
            return "";
        }

        let result = this.text.substring(dashes + 3);

        const links = result.indexOf("https://t.co/");
        if (links != -1) {
            result = result.substring(0, links);
        }

        result = result.replace("#Runkeeper", "").trim();

        if (result == "TomTom MySports Watch") {
            return "";
        }

        return result;
    }
}
