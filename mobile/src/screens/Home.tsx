import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { API } from "../lib/axios";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

type Summary = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<Summary>([]);

    const { navigate } = useNavigation();

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

    useFocusEffect(useCallback(() => {
        fetchSummary();
    }, []));

    if (loading) {
        return <Loading/>
    }
    
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
                        datesFromYearStart.map(date => {
                            const dayInSummary = summary?.find(day => dayjs(date).isSame(day.date, 'day'));

                            return <HabitDay
                                key={date.toString()}
                                date={date}
                                completed={dayInSummary?.completed}
                                amount={dayInSummary?.amount}
                                onPress={() => navigate('Habit', {
                                    date: date.toISOString()
                                })}
                            />
                        })
                    }

                    {                   
                        amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => 
                            <HabitDay key={i} active={false}/>
                        )
                    }
                </View>            
            </ScrollView>
        </View>
    );
}