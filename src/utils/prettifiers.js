import { format } from 'date-fns';


export const dateFormat = (date = '00.00.0000') => {
    const dateArray = format(new Date(date * 1000), 'dd.MMM.Y').split('.');
    dateArray[1] = dateArray[1].toUpperCase();
    return dateArray.join('.');
}

export const formatNumberWithCommas = (x) => {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    parts[1] = parts[1].slice(0,2);
    return parts.join(".");
}