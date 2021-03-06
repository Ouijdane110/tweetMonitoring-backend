const accessTwiter = require('../twitter-connect');
const CronJob = require('cron').CronJob;

const TwitterFunctions = {
    keywordsParse: (keyword) => {
        let regex = /[#]/g;
        let isMatch = keyword.match(regex);
        return !isMatch ? "#".concat(keyword) : keyword;
    },
    twitterFetchKeywordsByCountry: (idCountry) => {
        new CronJob('*/10 * * * * *', () => {
            accessTwiter.get('trends/place', { id: idCountry, count: 2 })
            .then((result) => {
                let parseData = [];
                let date = result[0].created_at;

                result[0].trends.map((keyword) => {
                    parseData.push({
                        date: date,
                        count: keyword.tweet_volume,
                        keyword: keyword.name
                    })
                });
                console.log('data parsed', parseData);
            })
            .catch((err) => {
                console.log('ERROR :', err.stack);
            })
        }).start();
    },
    twitterFetchKeywordsByKeyword: (word) => {
        new CronJob('*/10 * * * *', () => {
            accessTwiter.get('search/tweets', { q: TwitterFunctions.keywordsParse(word), count: 2 })
            .then((result) => {
                let parseData = [];
                result.statuses.map((keyword) => { 
                    parseData.push({
                        date: keyword.created_at,
                        idTweet: keyword.id,
                        keyword: TwitterFunctions.keywordsParse(word)
                    })
                });

                console.log('data parsed', parseData);
            })
            .catch((err) => {
                console.log('ERROR :', err.stack);
            })
        }).start();
    },
    twitterFetchTweetByUser: (userName) => {
        accessTwiter.get('statuses/user_timeline', { screen_name: userName, count: 2 })
        .then((result) => {
            const data = result.map((userData) => { 
                return {
                    userTwitterId: userData.id,
                    name: userData.user.name,
                    screen_name: userData.user.screen_name,
                    text: userData.text,
                    dateTweet: userData.created_at,
                    avatar: userData.user.profile_image_url
                };
            });
            return data;
        })
        .catch((err) => {
            console.log('ERROR :', err.stack);
        })
    }
}

module.exports = TwitterFunctions;