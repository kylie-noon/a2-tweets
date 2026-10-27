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

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	// new array
	const activityData = types.map(function (type) {
		return { activity: type, count: counts[type] };
	});

	// chart 1
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": activityData
		},
		//TODO: Add mark and encoding
		"mark": "bar",
		"encoding": {
			"x": { "field": "activity", "type": "nominal", "sort": "-y", "title": "Activity type" },
			"y": { "field": "count", "type": "quantitative", "title": "Number of tweets" }
		}

	};
	vegaEmbed('#activityVis', activity_vis_spec, { actions: false });


	const topThree = types.slice(0, 3);
	const topTweets = tweet_array.filter(function (t) {
		return topThree.includes(t.activityType);
	});

	// avg distance of tweet list
	function averageDistance(tweets) {
		let sum = 0;
		for (let i = 0; i < tweets.length; i++) {
			sum += tweets[i].distance;
		}
		return sum / tweets.length;
	}

	// avg distance for top 3 activities
	for (let i = 0; i < topThree.length; i++) {
		const type = topThree[i];
		const ofThisType = topTweets.filter(t => t.activityType == type);
		// console.log(type, averageDistance(ofThisType));
	}

	const weekendTweets = topTweets.filter(t => t.time.getDay() == 0 || t.time.getDay() == 6);
	const weekdayTweets = topTweets.filter(t => t.time.getDay() != 0 && t.time.getDay() != 6);
	// console.log("weekend", averageDistance(weekendTweets));
	// console.log("weekday", averageDistance(weekdayTweets));

	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "the weekend";

	// chart 2
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const distanceData = topTweets.map(function (t) {
		return {
			activity: t.activityType,
			day: dayNames[t.time.getDay()],
			distance: t.distance
		};
	});

	const distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": distanceData
		},
		"width": 400,
		"mark": { "type": "point", "opacity": 0.5 },
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayNames, "title": "time (day)" },
			"y": { "field": "distance", "type": "quantitative", "title": "distance" },
			"color": { "field": "activity", "type": "nominal", "title": "Activity" }
		}

	};
	vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });

	// chart 3
	const distance_mean_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": distanceData
		},
		"width": 400,
		"mark": { "type": "point", "opacity": 1 },
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayNames, "title": "time (day)" },
			"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean of distance" },
			"color": { "field": "activity", "type": "nominal", "title": "Activity" }
		}

	};
	vegaEmbed('#distanceVisAggregated', distance_mean_spec, { actions: false });

	document.getElementById('distanceVisAggregated').style.display = 'none';
	document.getElementById('aggregate').addEventListener('click', function () {
		const allGraph = document.getElementById('distanceVis');
		const meanGraph = document.getElementById('distanceVisAggregated');
		const button = document.getElementById('aggregate');

		if (meanGraph.style.display == 'none') {
			allGraph.style.display = 'none';
			meanGraph.style.display = 'block';
			button.innerText = 'Show all activities';
		} else {
			allGraph.style.display = 'block';
			meanGraph.style.display = 'none';
			button.innerText = 'Show means';
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});