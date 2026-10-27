function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": tweet_array
		}
		//TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, { actions: false });

	const counts = {};
	for (let i = 0; i < tweet_array.length; i++) {
		const t = tweet_array[i];
		if (t.source == "completed_event" && t.activityType != "unknown") {
			counts[t.activityType] = (counts[t.activityType] || 0) + 1;
		}
	}

	const types = Object.keys(counts);
	types.sort(function (a, b) {
		return counts[b] - counts[a];
	});

	document.getElementById('numberActivities').innerText = types.length;
	document.getElementById('firstMost').innerText = types[0];
	document.getElementById('secondMost').innerText = types[1];
	document.getElementById('thirdMost').innerText = types[2];

	for (let i = 0; i < 5; i++) {
		const t = tweet_array[i];
		console.log(t.activityType, t.distance);
	}
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});