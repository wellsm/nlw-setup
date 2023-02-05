import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { API } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function SummaryTable() {
    const [loading, setLoading] = useState<boolean>(true);
    const [summary, setSummary] = useState<Summary>([]);

    async function fetchSummary() {
        try {
            setLoading(true);

            const { data: response } = await API.get('/summary');
            
            setSummary(response);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    }

    useEffect(() => {
        fetchSummary()
    }, []);

    return (
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {
                    days.map((day, i) => (
                        <div
                            key={`${day}-${i}`}
                            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                        >
                            {day}
                        </div>
                    ))
                }
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {
                    !loading && summaryDates.map((date, i) => {
                        const dayInSummary = summary?.find(day => dayjs(date).isSame(day.date, 'day'))

                        return <HabitDay
                            key={date.toString()}
                            date={date}
                            defaultCompleted={dayInSummary?.completed}
                            amount={dayInSummary?.amount}
                        />
                    })
                }

                {                   
                    amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => <HabitDay key={i} active={false}/>)
                }
            </div>
        </div>
    )
}