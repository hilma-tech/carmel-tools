module.exports = new class TimeCalcs {


    //validate datetime with regex: ([0-9]{4}[-][0-9]{2}[-][0-9]{2}[T][0-9]{2}[:][0-9]{2}[:][0-9]{2}[.](000Z))

    // accepts: d - date
    //          useOffset - if we want to use israel's timezone
    // returns: datetime with format to post to database
    getTimezoneDatetime(d = Date.now(), useOffset = true) {
        // from this format -> 2/7/2020, 9:46:11
        // to this format   -> 2020-02-07T09:37:36.000Z
        if (!useOffset) { return new Date(d); }
        let now = new Date(d).toLocaleString("en-US", { timeZone: "Asia/Jerusalem", hour12: false });
        let nowArr = now.split(", ");
        let dateArr = nowArr[0].split("/");
        let month = dateArr[0].length === 2 ? dateArr[0] : "0" + dateArr[0];
        let day = dateArr[1].length === 2 ? dateArr[1] : "0" + dateArr[1];
        let date = dateArr[2] + "-" + month + "-" + day;
        let time = nowArr[1];
        let datetime = date + "T" + time + ".000Z";
        datetime = new Date(datetime);
        return datetime;
    }
}