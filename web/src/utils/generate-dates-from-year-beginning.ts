import dayjs from 'dayjs';

export function generateDatesFromYearBeginning() {
    const today = new Date()

    let dayOfTheYear = dayjs().startOf('year');

    const dates = [];

    while (dayOfTheYear.isBefore(today)) {
        dates.push(dayOfTheYear.toDate())
        dayOfTheYear = dayOfTheYear.add(1, 'day');
    }

    return dates;
}