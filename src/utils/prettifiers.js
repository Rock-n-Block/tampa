import { format } from 'date-fns';


export const dateFormat = (date = '00.00.0000') => {
    const dateArray = format(new Date(date * 1000), 'dd.MMM.Y').split('.');
    dateArray[1] = dateArray[1].toUpperCase();
    return dateArray.join('.');
}