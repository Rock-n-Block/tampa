import { format } from 'date-fns';


export const dateFormat = (date) => {
    const dateArray = format(new Date(date * 1000), 'dd.MMM.Y').split('.');
    dateArray[1] = dateArray[1].toUpperCase();
    return dateArray.join('.');
}

export const formatNumberWithCommas = (x) => {
    if (!x) return null
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts[1]) parts[1] = parts[1].slice(0,2);
    return parts.join(".");
}