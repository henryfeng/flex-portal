import dayjs from "dayjs";

/**
 * 获取今天的日期，时间为当地时区的00:00:00.000
 */
const today = () => {
    let d = dayjs();
    return d.hour(0).minute(0).second(0).millisecond(0);
}

/**
 * 返回当前的时间
 */
const now = () => {
    return dayjs()
}

export default {today, now}