const rp         = require('request-promise');
const mongoose   = require('mongoose'); 

homeTeam = [];  //home team name
awayTeam = [];  //away team name
openOdds = [];  //opening odds
currOdds = [];  //current odds
awayPerc = [];  //away money distribution
homePerc = [];  //home money distribution
mergRecs = [];

//connection information 
const mongourl   = '192.168.1.26'
const collection = 'ninjago' 
mongoose.connect(`mongodb://${mongourl}/${collection}`, { useMongoClient: true});
mongoose.Promise = global.Promise; 

//sports action API connection
const actionApi = {
	url: 'https://api-prod.sprtactn.co/web/v1/scoreboard/mlb?date=20180522',
	json: true
}

//home team, away team, opening odds, and closing odds API pul
rp(actionApi)
	.then((data) => { 

const games = data.games

	games.forEach((games) => {
		
		games.teams.forEach((teams, i) => {
			if (games.home_team_id == games.teams[i].id) {
				homeTeam.push({home_team: games.teams[i].full_name}); 
			} else if (games.away_team_id == games.teams[i].id) {
				awayTeam.push({away_team: games.teams[i].full_name}); 
			}
		})

		games.odds.forEach((odds, i) => {
			if (games.odds[i].type == "game" && games.odds[i].book_id == "15") {
				currOdds.push({
								currAwayLine: games.odds[i].ml_away, 
								currHomeLine: games.odds[i].ml_home, 
								currAwaySpread: games.odds[i].spread_away, 
								currHomeSpread: games.odds[i].spread_home, 
								currAwayTotal: games.odds[i].total,
								currHomeTotal: games.odds[i].total,
								homeMlBets: games.odds[i].ml_home_public,
								awayMlBets: games.odds[i].ml_away_public,
								totalOverBets: games.odds[i].total_over_public,
								totalUnderBets: games.odds[i].total_under_public,
								spreadHomeBets: games.odds[i].spread_home_public,
								spreadAwayBets: games.odds[i].spread_away_public
							})
			} else if (games.odds[i].type == "game" && games.odds[i].book_id == "30") {
				openOdds.push({
								openAwayLine: games.odds[i].ml_away, 
								openHomeLine: games.odds[i].ml_home, 
								openAwaySpread: games.odds[i].spread_away, 
								openHomeSpread: games.odds[i].spread_home,
								openAwayTotal: games.odds[i].total,
								openHomeTotal: games.odds[i].total
							})
			} 
		})
	})

		for (i = 0; i < homeTeam.length; i++) {
			mergRecs.push({
				homeTeam: homeTeam[i].home_team, 
				awayTeam: awayTeam[i].away_team,
				currAwayLine: currOdds[i].currAwayLine,
				currHomeLine: currOdds[i].currHomeLine,
				openAwayLine: openOdds[i].openAwayLine,
				openHomeLine: openOdds[i].openHomeLine,
				currAwaySpread: currOdds[i].currAwaySpread,
				currHomeSpread: currOdds[i].currHomeSpread,
				openAwaySpread: openOdds[i].openAwaySpread,
				openHomeSpread: openOdds[i].openHomeSpread,
				currAwayTotal: currOdds[i].currAwayTotal,
				currHomeTotal: currOdds[i].currHomeTotal,
				openAwayTotal: openOdds[i].openAwayTotal,
				openHomeTotal: openOdds[i].openAwayTotal,
				homeMlBets: currOdds[i].homeMlBets,
				awayMlBets: currOdds[i].awayMlBets,
				totalOverBets: currOdds[i].totalOverBets,
				totalUnderBets: currOdds[i].totalUnderBets,
				spreadHomeBets: currOdds[i].spreadHomeBets,
				spreadAwayBets: currOdds[i].spreadAwayBets
			})
			
		}
		console.log(mergRecs)
})
.catch((err) => {
	console.log(err);
});