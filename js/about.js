function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	let earliest = tweet_array[0].time;
	let latest = tweet_array[0].time;

	for (let i = 1; i < tweet_array.length; i++) {
		const current = tweet_array[i].time;

		if (current < earliest) {
			earliest = current;
		}

		if (current > latest) {
			latest = current;
		}
	}

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

	const earliestText = earliest.toLocaleDateString('en-US', options);
	const latestText = latest.toLocaleDateString('en-US', options);

	console.log(earliestText)
	console.log(latestText)

	document.getElementById('firstDate').innerText = earliestText;
	document.getElementById('lastDate').innerText = latestText;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});