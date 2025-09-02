import { format } from "date-fns";

export const formatDateTimeToLocale = (dateTime) => {
    if (!dateTime) return "";
    const utcDate = new Date(dateTime);
    const formattedLocalTime = format(utcDate, "yyyy-MM-dd HH:mm:ss");
    return formattedLocalTime;
};
