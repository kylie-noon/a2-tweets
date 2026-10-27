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

	// tweet dates
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

	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "miscellaneous") {
			console.log(tweet_array[i].text);
		}
	}

	// tweet categories
	let completed = 0;
	let live = 0;
	let achievements = 0;
	let misc = 0;

	for (let i = 0; i < tweet_array.length; i++) {
		const src = tweet_array[i].source;
		if (src == "completed_event") {
			completed++;
		} else if (src == "live_event") {
			live++;
		} else if (src == "achievement") {
			achievements++;
		} else {
			misc++;
		}
	}
	console.log(completed, live, achievements, misc);

	const total = tweet_array.length;
	setText('completedEvents', completed);
	setText('completedEventsPct', formatPct(completed, total));

	setText('liveEvents', live);
	setText('liveEventsPct', formatPct(live, total));

	setText('achievements', achievements);
	setText('achievementsPct', formatPct(achievements, total));

	setText('miscellaneous', misc);
	setText('miscellaneousPct', formatPct(misc, total));

	const completedTweets = tweet_array.filter(t => t.source == "completed_event");
	const writtenCount = completedTweets.filter(t => t.written).length;

	setText('written', writtenCount);
	setText('writtenPct', formatPct(writtenCount, completed));

	// temp for user writte logs
	let shown = 0;
	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			console.log(tweet_array[i].writtenText);
			shown++;
			if (shown == 20) break;
		}
	}
}

function setText(className, value) {
	const elements = document.querySelectorAll('.' + className);
	elements.forEach(function (elem) {
		elem.innerText = value;
	});
}

function formatPct(part, total) {
	return math.format((part / total) * 100, { notation: 'fixed', precision: 2 }) + '%';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});