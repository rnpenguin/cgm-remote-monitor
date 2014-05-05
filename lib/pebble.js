
function pebble (req, res) {

    function directionToTrend(direction) {
        var trend = 8;

        switch (direction) {
            case "NONE":
                trend = 0;
                break;
            case "DoubleUp":
                trend = 1;
                break;
            case "SingleUp":
                trend = 2;
                break;
            case "FortyFiveUp":
                trend = 3;
                break;
            case "Flat":
                trend = 4;
                break;
            case "FortyFiveDown":
                trend = 5;
                break;
            case "SingleDown":
                trend = 6;
                break;
            case "DoubleDown":
                trend = 7;
                break;
            case "NOT COMPUTABLE":
                trend = 8;
                break;
            case "RATE OUT OF RANGE":
                trend = 9;
                break;
            default:
                trend = 8;
        }

        return trend;
    }

    function get_latest (err, collection) {
        if (err)
            return res.send(err);
        else
            collection.find().sort({timestamp: -1}).limit(3).toArray(function (err, entries) {
                if (err)
                    return res.send(err);
                else {
                    var reversed = entries.reverse(),
                        prev = null,
                        bgdelta = 0;

                    var bgs = reversed.map(function (entry) {
                        if (prev && prev.bg > 39 && entry.bg > 39) {
                            bgdelta = entry.bg - prev.bg;
                        }
                        prev = entry;

                        return {
                            datetime: new Date(entry.timestamp),
                            sgv: entry.bg.toString(),
                            trend: directionToTrend(entry.direction),
                            direction: entry.direction,
                            bgdelta: bgdelta
                        };

                    }).reverse();

                    var result = {
                        status: [
                            {now: new Date()}
                        ],
                        bgs: bgs
                    };

                    res.write(JSON.stringify(result));
                    res.end();

                }
            });
    }

    req.with_collection(get_latest);
}

pebble.pebble = pebble;
module.exports = pebble;

