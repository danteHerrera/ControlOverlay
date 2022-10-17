import { WsSubscribers } from "./WS.js";

let ws = new WebSocket('ws://localhost:6969');

const secondsToTime = (seconds, ms, showMs) => {
    if (seconds == 0) {
        return "00.0";
    } if (showMs) {
        if (ms % 1 == 0) { ms = ms - 1 }
        console.log((new Date(ms * 1000).toISOString().substr(showMs ? 17 : 15, 4)));
        return (new Date(ms * 1000).toISOString().substr(showMs ? 17 : 15, 4));
    }
    return (new Date(seconds * 1000).toISOString().substr(showMs ? 17 : 15, 4));

};

const findPlayers = (playerGameObj, teamNum) => {
    let playerList = [];
    let teamNumList = [];
    let teamList = [];
    for (let item in playerGameObj) {
        if (playerGameObj.hasOwnProperty(item)) {
            let value = playerGameObj[item];
            playerList.push(item);
        }
    }
    for (let player in playerList) {
        let primePlayer = playerList[player];
        if (playerGameObj[primePlayer]['team'] == teamNum) {
            teamNumList.push(playerGameObj[primePlayer]["name"]);
        }
    }
    return teamNumList
};
let leftTeamName = "";
let rightTeamName = "";
const valueHandler = () => {
    let seriesTitle = "";
    let roundTitle = "";
    let seriesLength = 1;
    let gameNumber = 1;

    let lTeamSScore = 0;
    let rTeamSScore = 0;
    let nameOverride = false;

    const sLengthOptions = 7;
    const gNumberOptions = 7;
    seriesTitle = document.getElementById('form-value-input1').value;
    roundTitle = document.getElementById('form-value-input2').value;
    let i = 1;
    while (i <= sLengthOptions) {
        if (document.getElementById('series-length' + i).checked == true) {
            seriesLength = i;
            break;
        }
        i += 2;
    }
    i = 1;
    while (i <= gNumberOptions) {
        if (document.getElementById('game-number' + i).checked == true) {
            gameNumber = i;
            break;
        }
        i += 2;
    }
    leftTeamName = document.getElementById('form-value-input5').value;
    rightTeamName = document.getElementById('form-value-input6').value;
    lTeamSScore = document.getElementById('form-value-input7').value;
    rTeamSScore = document.getElementById('form-value-input8').value;


    (leftTeamName != '') ? nameOverride = true : nameOverride = false;

    return {
        "event": "control-panel-info",
        seriesTitle,
        roundTitle,
        seriesLength,
        gameNumber,
        leftTeamName,
        rightTeamName,
        lTeamSScore,
        rTeamSScore,
        nameOverride
    };
}

$(() => {
    WsSubscribers.init(49322, true, ['game:update_state', 'game:match_created']);

    WsSubscribers.subscribe("game", "update_state", (d) => {

        let scoreLeft = (d['game']['teams'][0]['score']);
        let scoreRight = (d['game']['teams'][1]['score']);

        //Time updater
        let time = (d['game']['isOT'] ? '+' : '') + secondsToTime(
            d['game']['time_seconds'], d['game']['time_milliseconds'],
            d['game']['time_seconds'] < 60 && !d['game']['isOT'] && d['game']['time'] != 59
        );

        let teamOne = findPlayers(d['players'], 0);
        let teamTwo = findPlayers(d['players'], 1);

        //Player names
        // for (let i = 0; i < teamOne.length; i++) {
        //     let id = i+1;
        //     $('#player-name' + id).text(teamOne[i]);
        //     $('#bubble-number' + id).css("background-color", "rgb(3, 127, 252)");
        // }
        // for (let i = 0; i < teamTwo.length; i++) {
        //     let id = i+5;
        //     $('#player-name' + id).text(teamTwo[i]);
        //     $('#bubble-number' + id).css("background-color", "orange");
        // }

        //Focused Player
        let target = d['game']['target'];
        try {
            target = (d['players'][target]['name']);
        } catch (e) {
            // console.log('No player is focused.')
        }

        ws.send(JSON.stringify({
            "event": "scorebug-event",
            "time": time,
            "Score Left": scoreLeft,
            "Score Right": scoreRight,
            "Team One Roster": teamOne,
            "Team Two Roster": teamTwo,
            "Target": target,
        }))

        let teamLeft, teamRight;
        // Team Names
        if (teamOne[1] == null) {
            teamLeft = (teamOne[0]);
        } else {
            teamLeft = (d['game']['teams'][0]['name']);
        }
        if (teamTwo[1] == null) {
            teamRight = (teamTwo[0]);
        } else {
            teamRight = (d['game']['teams'][1]['name']);
        }

        ws.send(JSON.stringify({
            "event": "team-names",
            "Team Left": teamLeft,
            "Team Right": teamRight,
            "Team Left Override": leftTeamName,
            "Team Right Override": rightTeamName
        }))
    })

    WsSubscribers.subscribe("game", "match_ended", (d) => {

    })
})

export { valueHandler };

// Make valueHandler.js handle ALL events.