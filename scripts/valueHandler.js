let seriesTitle = "";
let roundTitle = "";
let seriesLength = 1;
let gameNumber = 1;
let leftTeamName = "";
let rightTeamName = "";
let lTeamSScore = 1;
let rTeamSScore = 1;

const sLengthOptions = 7;
const gNumberOptions = 7;

const valueHandler = () => {
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

    return {
        seriesTitle,
        roundTitle,
        seriesLength,
        gameNumber,
        leftTeamName,
        rightTeamName,
        lTeamSScore,
        rTeamSScore
    };
}
// console.log("seriesTitle " + seriesTitle)
// console.log("roundTitle " + roundTitle)
// console.log("seriesLength " + seriesLength)
// console.log("gameNumber " + gameNumber)
// console.log("leftTeamName " + leftTeamName)
// console.log("rightTeamName " + rightTeamName)
// console.log("lTeamSScore " + lTeamSScore)
// console.log("rTeamSScore " + rTeamSScore)