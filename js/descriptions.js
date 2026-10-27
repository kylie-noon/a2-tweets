let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	const tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// user written tweets
	written_tweets = tweet_array.filter(function (t) {
		return t.written;
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById('textFilter');

	searchBox.addEventListener('input', function () {
		const searchText = searchBox.value;

		if (searchText == "") {
			document.getElementById('tweetTable').innerHTML = "";
			document.getElementById('searchCount').innerText = 0;
			document.getElementById('searchText').innerText = "";
			return;
		}

		// tweets with search text
		const matches = written_tweets.filter(function (t) {
			return t.text.toLowerCase().includes(searchText.toLowerCase());
		});

		// rows
		let rows = "";
		for (let i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}

		document.getElementById('tweetTable').innerHTML = rows;
		document.getElementById('searchCount').innerText = matches.length;
		document.getElementById('searchText').innerText = searchText;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});