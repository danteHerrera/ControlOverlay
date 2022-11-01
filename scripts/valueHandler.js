import { WsSubscribers } from "./WS.js";

let ws = new WebSocket('ws://localhost:6969');

const secondsToTime = (seconds, ms, showMs) => {
    if (seconds == 0) {
        return "00.0";
    } if (showMs) {
        if (ms % 1 == 0) { ms = ms - 1 }
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
        i += 1;
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
        nameOverride,
        // teamOneObj,
        // teamTwoObj
    };
}

const teamValues = () => {
    let teamOnePrimary = "#0071bc";
    let teamOneSecondary = "#2e3192";
    let teamOneTextColor = "white";
    let teamTwoPrimary = "#f7931e";
    let teamTwoSecondary = "#f15a24";
    let teamTwoTextColor = "white";
    let teamOneImg = ".edit/Default.webp";
    let teamTwoImg = ".edit/Default.webp";

    //shouldve used ternary operators but i was already halfway done with if satements :/

    if (document.getElementById('team-one-prim').value) {
        teamOnePrimary = document.getElementById('team-one-prim').value;
    }
    if (document.getElementById('team-one-sec').value) {
        teamOneSecondary = document.getElementById('team-one-sec').value;
    }
    if (document.getElementById('team-one-text').value) {
        teamOneTextColor = document.getElementById('team-one-text').value;
    }
    if (document.getElementById('team-two-prim').value) {
        teamTwoPrimary = document.getElementById('team-two-prim').value;
    }
    if (document.getElementById('team-two-sec').value) {
        teamTwoSecondary = document.getElementById('team-two-sec').value;
    }
    if (document.getElementById('team-two-text').value) {
        teamTwoTextColor = document.getElementById('team-two-text').value;
    }
    if (document.getElementById('team-one-logo').value) {
        teamOneImg = ".edit/" + document.getElementById('team-one-logo').value;
    }
    if (document.getElementById('team-two-logo').value) {
        teamTwoImg = ".edit/" + document.getElementById('team-two-logo').value;
    }

    console.log(teamOneImg);

    return {
        "event": "Team Values",
        "Team One Data": {
            "Primary": teamOnePrimary,
            "Secondary": teamOneSecondary,
            "Text": teamOneTextColor,
            "Logo": teamOneImg
        },
        "Team Two Data": {
            "Primary": teamTwoPrimary,
            "Secondary": teamTwoSecondary,
            "Text": teamTwoTextColor,
            "Logo": teamTwoImg
        }
    }

}


$(() => {
    WsSubscribers.init(49322, true, ['game:update_state', 'game:match_created', 'game:goal_scored']);

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

        let teams = [...teamOne, ...teamTwo];

        //Focused Player
        let target = d['game']['target'];
        try {
            target = (d['players'][target]['name']);
        } catch (e) {
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

        ws.send(JSON.stringify({
            "event": "test",
            "players": d
        }));


        let gameMode;
        let OneBoostAmounts = {}, TwoBoostAmounts = {};

        if (teamOne[0] == null) {
            gameMode = 0;
        } else if (teamOne[1] == null) {
            gameMode = 1;
        } else if (teamOne[2] == null) {
            gameMode = 2;
        } else if (teamOne[3] == null) {
            gameMode = 3;
        } else if (teamOne[4] == null) {
            gameMode = 4;
        }

        let i = 0;
        while (i < gameMode) {
            OneBoostAmounts[teamOne[i]] = d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == teamOne[i])]["boost"];
            TwoBoostAmounts[teamTwo[i]] = d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == teamTwo[i])]["boost"];
            i++;
        }
        let playerObj = { ...OneBoostAmounts, ...TwoBoostAmounts };

        let focusedPlayerInfo = { "Name": target };

        if (teamOne.includes(target)) {
            focusedPlayerInfo["Team"] = 0;
        } else if (teamTwo.includes(target)) {
            focusedPlayerInfo["Team"] = 1;
        }


        if (target in playerObj) {
            focusedPlayerInfo["Boost Amount"] = playerObj[target];
        }

        ws.send(JSON.stringify({
            "event": "boost",
            "Game Mode": gameMode,
            "Team One Boost Amounts": OneBoostAmounts,
            "Team Two Boost Amounts": TwoBoostAmounts,
            "Focused Player": focusedPlayerInfo,
        }))


        try {
            focusedPlayerInfo["Stats"] = {
                "Assists": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["assists"],
                "Demos": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["demos"],
                "Goals": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["goals"],
                "Saves": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["saves"],
                "Score": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["score"],
                "Shots": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["shots"],
                "Touches": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["touches"],
                "Team": d["players"][Object.keys(d["players"]).find(key => d["players"][key]["name"] == focusedPlayerInfo["Name"])]["team"]
            }
        } catch (e) {
        }

        ws.send(JSON.stringify({
            "event": "focus",
            "Focused Player": focusedPlayerInfo,
        }))
    })

    WsSubscribers.subscribe("game", "match_ended", (d) => {

    })

    WsSubscribers.subscribe("game", "goal_scored", d => {

        let assister = d["assister"]["name"];
        let goalSpeed = Math.round(d["goalspeed"] * 10) / 10;
        let goalTime = secondsToTime(d["goaltime"], d["goaltime"], false);
        let scorer = d["scorer"]["name"];
        let scorerTeam = d["scorer"]["teamnum"];

        ws.send(JSON.stringify({
            "event": "goal",
            "Assister": assister,
            "Scorer": scorer,
            "Speed": goalSpeed,
            "Time": goalTime,
            "Team": scorerTeam
        }))

    })

    WsSubscribers.subscribe("game", "match_ended", d => {
        ws.send(JSON.stringify({
            "event": "end",
            "Winner": d["winner_team_num"]
        }))
    })
})

export { valueHandler, teamValues };

// Make valueHandler.js handle ALL events.