let message: string = 'Hello, World!';
console.log(message);

const FIVE_MINUTES: number = 5 * 60 * 1000;
const TWO_HOURS: number = 2 * 60 * 60 * 1000;
const ONE_HOUR: number = 60 * 60 * 1000;
const ONE_MINUTE: number = 60 * 1000;

class TimeEstimate {
    hours: number;
    minutes: number;

    constructor(hours: number, minutes: number) {
        this.hours = hours;
        this.minutes = minutes;
    }

    getString() {
        return ((this.hours != -1) ? this.hours + "h " : "") + ((this.minutes != -1) ? this.minutes + "min" : "");
    }

    isMinutesOnly() {
        return this.hours == -1 && this.minutes != -1;
    }

    isHoursOnly() {
        return this.hours != -1 && this.minutes == -1;
    }

    isEqual(other: TimeEstimate) {
        return this.hours == other.hours && this.minutes == other.minutes;
    }
}

console.log(timeEstimate('2021-01-10T01:30:00.000Z', '2021-01-10T02:02:23.000Z', '2021-01-10T05:07:22.000Z'))
console.log(timeEstimate('2021-01-10T01:30:00.000Z', '2021-01-10T02:01:11.000Z', '2021-01-10T02:04:22.000Z'))
console.log(timeEstimate('2021-01-10T01:30:00.000Z', '2021-01-10T00:02:23.000Z', '2021-01-10T02:07:22.000Z'))
console.log(timeEstimate('2021-01-10T01:30:00.000Z', '2021-01-10T02:02:23.000Z', '2021-01-10T02:40:22.000Z'))
console.log(timeEstimate('2021-01-10T01:30:00.000Z', '2021-01-10T02:02:23.000Z', '2021-01-10T02:24:22.000Z'))
console.log(timeEstimate('2021-01-10T01:30:00.000Z', '2021-01-10T00:02:23.000Z', '2021-01-10T00:57:22.000Z'))

function timeEstimate(currentTs: string, lowerEstimate: string, upperEstimate: string) {
    let current = new Date(currentTs);
    let lower = new Date(lowerEstimate);
    let upper = new Date(upperEstimate);

    let currentTime = current.getTime();
    let lowerTime = lower.getTime();
    let upperTime = upper.getTime();

    if (isNaN(currentTime) || isNaN(lowerTime) || isNaN(upperTime) || lowerEstimate > upperEstimate + FIVE_MINUTES) {
        return 'Invalid input';
    }

    if (upperTime < currentTime) {
        return 'as soon as possible';
    } else if (lowerTime < currentTime) {
        let upperWaitTimeMs = upperTime - currentTime
        return convertIntervalToStr(upperWaitTimeMs).getString();
    } else {
        let lowerWaitTimeMs = lowerTime - currentTime;
        let upperWaitTimeMs = upperTime - currentTime;

        let lowerEstimate = convertIntervalToStr(lowerWaitTimeMs);
        let upperEstimate = convertIntervalToStr(upperWaitTimeMs);

        if (lowerEstimate.isEqual(upperEstimate)) {
            return lowerEstimate.getString();
        } else {
            if (lowerEstimate.isHoursOnly() && upperEstimate.isHoursOnly()) {
                return lowerEstimate.hours + ' - ' + upperEstimate.hours + 'h';
            } else if (lowerEstimate.isMinutesOnly() && upperEstimate.isMinutesOnly()) {
                return lowerEstimate.minutes + ' - ' + upperEstimate.minutes + 'min';
            } else {
                return lowerEstimate.getString() + ' - ' + upperEstimate.getString();
            }
        }
    }
}

function convertIntervalToStr(interval: number) {
    let convertedInterval = capeAndRoundEstimate(interval);
    if (convertedInterval % ONE_HOUR === 0) {
        return new TimeEstimate(convertedInterval / ONE_HOUR, -1);
    } else if (convertedInterval < ONE_HOUR) {
        return new TimeEstimate(-1, convertedInterval / ONE_MINUTE);
    } else {
        return new TimeEstimate(1, (convertedInterval - ONE_HOUR) / ONE_MINUTE);
    }
}

function capeAndRoundEstimate(interval: number) {
    if (interval > TWO_HOURS) {
        return TWO_HOURS;
    } else {
        return Math.floor(interval / (FIVE_MINUTES)) * (FIVE_MINUTES);
    }
}