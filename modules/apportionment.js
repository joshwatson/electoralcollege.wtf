export function hillMethod(states, year, seats, DCstatehood=false)
{
    var usPopulation = 0;
    var censusYear = Math.floor((year-1) / 10) * 10;
    console.log('census year is ' + censusYear.toString());

    for (var state in states)
    {
        usPopulation += states[state].population[censusYear];
    }

    console.log('usPopulation is ' + usPopulation.toString());

    var d = usPopulation / seats;

    console.log('d is ' + d.toString());

    var totalEV = 0;

    var stateSeats = {};
    var stateA = {};

    for (var state in states)
    {
        if (DCstatehood == false && state == 'DC') continue;
        stateSeats[state] = 1;
        stateA[state] = states[state].population[censusYear] / Math.sqrt(2);
    }

    var totalSeats = Object.keys(stateSeats).length;
    console.log(totalSeats)

    while (totalSeats < seats)
    {
        var nextSeat = Object.keys(stateA).reduce(function(a, b){ return stateA[a] > stateA[b] ? a : b });
        var n = ++stateSeats[nextSeat];
        console.log(nextSeat)
        stateA[nextSeat] *= Math.sqrt((n-1)/(n+1));

        totalSeats++;
    }

    console.log(totalSeats)

    for (var state in states)
    {
        if (DCstatehood == false && state == 'DC')
        {
            stateSeats[state] = 3;
        }
        else
        {
            stateSeats[state] += 2;
        }
    }

    return stateSeats;
}