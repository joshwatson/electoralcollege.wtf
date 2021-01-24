'use strict';

import { states } from './states.js';
import { popularVote, candidates } from './popular-vote.js';
import { hillMethod } from './apportionment.js';

window.addEventListener(
    "load",
    function() {
        var svgObject = document.getElementById('svg-object')
        var statePaths = svgObject.contentDocument.getElementById('svg').getElementsByTagName('path');

        var year = 2000;

        var EVs = hillMethod(states, year, 435, false);

        var rEVs = 0;
        var dEVs = 0;

        for (var state in states)
        {
            var title = document.createElementNS("http://www.w3.org/2000/svg","title");

            var result = states[state].results[year]

            title.textContent = states[state].name + '\n' + EVs[state].toString() + ' EVs';
            statePaths[state].appendChild(title);

            if (result == 'R')
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


            // statePaths[state].addEventListener(
            //     "mouseover",
            //     function() { this.style.fill = 'yellow' }
            // )

            // statePaths[state].addEventListener(
            //     "mouseout",
            //     function() { this.style.fill = 'white' }
            // )

            // statePaths[state].addEventListener(
            //     "click",
            //     function() { 
            //         if (this.style.fill == 'red')
            //         {
            //             this.style.fill = 'blue';
            //         }
            //         else if (this.style.fill == 'blue')
            //         {
            //             this.style.fill = 'white';
            //         }
            //         else
            //         {
            //             this.style.fill = 'red';
            //         }
            //     }
            // )
        }

        console.log('R EVs' + rEVs.toString());
        console.log('D EVs' + dEVs.toString());

        let totalEVs = dEVs + rEVs;
        let dWidth = (dEVs / totalEVs) * 100;
        let resultColumns = "[dem] " + dWidth.toFixed(2) + "% [repub] auto";
        console.log(resultColumns)

        document.getElementById("voteResults").style.gridTemplateColumns = resultColumns;
        document.getElementById("democratResults").innerHTML = dEVs.toString();
        document.getElementById("republicanResults").innerHTML = rEVs.toString();
        document.getElementById("demCandidate").innerHTML = candidates[year]['D'] + '<br />' + popularVote[year]['D'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById("repubCandidate").innerHTML = candidates[year]['R'] + '<br />' + popularVote[year]['R'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
        
        if (popularVote[year]['D'] > popularVote[year]['R'])
        {
            document.getElementById("demCandidate").style.fontWeight = "bold";
        }
        else
        {
            document.getElementById("repubCandidate").style.fontWeight = "bold";
        }

        if (dEVs > rEVs)
        {
            document.getElementById("democratResults").innerHTML += "🎉";
        }
        else if (rEVs > dEVs)
        {
            document.getElementById("republicanResults").innerHTML = "🎉" + document.getElementById("republicanResults").innerHTML;
        }
    }
);