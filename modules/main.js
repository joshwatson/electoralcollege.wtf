'use strict';

import { states } from './states.js';
import { popularVote, prPopularVote, candidates } from './popular-vote.js';
import { hillMethod } from './apportionment.js';

var year = 2024;
var seats = 435;
var dcStatehood = false;
var prStatehood = false;

document.getElementById("yearSelect").addEventListener(
    "change",
    function()
    {
        year = parseInt(this.value);

        let prStatehoodBox = document.getElementById("prStatehood");
        if (year < 2024) {
            prStatehoodBox.checked = false;
            prStatehoodBox.disabled = true;
        } else {
            prStatehoodBox.disabled = false;
        }

        update();
    }
)

window.addEventListener(
    "hashchange",
    function(event)
    {
        update();
    }
)

document.getElementById("seats").addEventListener(
    "input",
    function()
    {
        seats = parseInt(this.value);
        document.getElementById("currentSeats").innerHTML = this.value;
        window.location.hash = 'seats=' + this.value
        update();
    }
)

document.getElementById("dcStatehood").addEventListener(
    "input",
    function()
    {
        console.log(this.value);
        dcStatehood = this.checked;
        console.log(dcStatehood);
        update();
    }
)

document.getElementById("prStatehood").addEventListener(
    "input",
    function()
    {
        console.log(this.value);
        prStatehood = this.checked;
        console.log(prStatehood);
        update();
    }
)

function checkSeatsHash() {
    var seatsHash = window.location.hash;

    if (seatsHash != '')
    {
        console.log(seatsHash);
        seatsHash = seatsHash.replace('#seats=','');
        seats = parseInt(seatsHash);
        console.log('Seats: ' + seats);
        document.getElementById("seats").value = seats;
        document.getElementById("currentSeats").innerHTML = seats;
    }
    else
    {
        window.location.hash = 'seats=' + document.getElementById("seats").value;
    }
}

function update() {
    checkSeatsHash();

    var svgObject = document.getElementById('svg-object')
    var statePaths = svgObject.contentDocument.getElementById('svg').getElementsByTagName('path');

    var EVs = hillMethod(states, year, seats, dcStatehood, prStatehood);

    var rEVs = 0;
    var dEVs = 0;

    for (var state in states)
    {
        var title = document.createElementNS("http://www.w3.org/2000/svg","title");

        var result = states[state].results[year]

        title.textContent = states[state].name + '\n' + EVs[state].toString() + ' EVs';
        console.log(title.textContent)

        statePaths[state].appendChild(title);

        if (EVs[state] == 0)
        {
            statePaths[state].style.fill = 'white';
        }
        else if (result == 'R')
        {
            statePaths[state].style.fill = 'red';
            rEVs += EVs[state]
        }
        else if (result == 'D')
        {
            statePaths[state].style.fill = 'blue';
            dEVs += EVs[state]
        }
        else
        {
            statePaths[state].style.fill = 'url(#diagonalHatch)';
            if (result['R'] > result['D'])
            {
                dEVs += result['D']
                rEVs += EVs[state] - result['D'];
            }
            else
            {
                rEVs += result['R'];
                dEVs += EVs[state] - result['R'];
            }
        }

    }

    console.log('R EVs ' + rEVs.toString());
    console.log('D EVs ' + dEVs.toString());

    let totalEVs = dEVs + rEVs;
    console.log('Total EVs ' + totalEVs);

    let dWidth = (dEVs / totalEVs) * 100;
    let resultColumns = "[dem] " + dWidth.toFixed(2) + "% [repub] auto";
    console.log(resultColumns)

    var thisPopularVote = {};
    thisPopularVote['D'] = popularVote[year]['D'];
    thisPopularVote['R'] = popularVote[year]['R'];

    if (prStatehood) {
        thisPopularVote['D'] += prPopularVote[year]['D'];
        thisPopularVote['R'] += prPopularVote[year]['R'];
    }

    document.getElementById("voteResults").style.gridTemplateColumns = resultColumns;
    document.getElementById("democratResults").innerHTML = dEVs.toString();
    document.getElementById("republicanResults").innerHTML = rEVs.toString();
    document.getElementById("demCandidate").innerHTML = candidates[year]['D'] + '<br />' + thisPopularVote['D'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("repubCandidate").innerHTML = candidates[year]['R'] + '<br />' + thisPopularVote['R'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;

    if (thisPopularVote['D'] > thisPopularVote['R'])
    {
        document.getElementById("demCandidate").style.fontWeight = "bold";
        document.getElementById("repubCandidate").style.fontWeight = "normal";
    }
    else
    {
        document.getElementById("repubCandidate").style.fontWeight = "bold";
        document.getElementById("demCandidate").style.fontWeight = "normal";
    }

    if (dEVs > rEVs)
    {
        document.getElementById("democratResults").innerHTML += "✅";
    }
    else if (rEVs > dEVs)
    {
        document.getElementById("republicanResults").innerHTML = "✅" + document.getElementById("republicanResults").innerHTML;
    }
}

window.addEventListener(
    "load",
    update
);