import { Text, View, ScrollView } from "react-native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

export function Home() {
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>

            <View className="flex-row mt-6 mb-2">
                { 
                    weekDays.map((weekDay, i) => (
                        <Text
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{
                                width: DAY_SIZE
                            }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map(date => (
                            <HabitDay
                                key={date.toString()}
                            />
                        ))
                    }

                    {                   
                        amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => <HabitDay key={i} active={false}/>)
                    }
                </View>            
            </ScrollView>
        </View>
    );
}