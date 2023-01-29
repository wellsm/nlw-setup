import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {

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
                    summaryDates.map((date, i) => (
                        <HabitDay key={date.toString()}/>
                    ))
                }

                {                   
                    amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => <HabitDay key={i} active={false}/>)
                }
            </div>
        </div>
    )
}