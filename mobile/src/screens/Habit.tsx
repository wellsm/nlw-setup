import { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useRoute } from '@react-navigation/native';

import dayjs from 'dayjs';

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { API } from "../lib/axios";
import { Loading } from "../components/Loading";
import { EmptyHabit } from "../components/EmptyHabit";
import clsx from "clsx";
import { SafeAreaView } from "react-native-safe-area-context";

interface Params {
    date: string,
    completed?: number,
    amount?: number,
}

const availableWeekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
];

type Habits = Array<{
    id: string,
    title: string,
    created_at: string,
    completed: boolean,
}>

export function Habit() {
    const route = useRoute();
    const { date } = route.params as Params;

    const [loading, setLoading] = useState<boolean>(true);
    const [habits, setHabits] = useState<Habits>([]);

    const progress = generateProgressPercentage(habits.length, habits.filter(habit => habit.completed).length);

    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date);
    const weekDay = parsedDate.day();
    const dayAndMonth = parsedDate.format('DD/MM');

    async function fetchHabits() {
        setLoading(true);

        try {
            const { data: response } = await API.get('/day', {
                params:  {
                    date: parsedDate.endOf('day').toISOString()
                }
            });

            setHabits(response);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    }

    async function toggleHabits(id: string) {
        await API.patch(`/habits/${id}/toggle`);

        const updatedHabits = habits.map(habit => ({ 
            ...habit,
            completed: habit.id === id ? !habit.completed : habit.completed
        }));

        setHabits(updatedHabits);
    }

    useEffect(() => {
        fetchHabits();
    }, []);

    if (loading) {
        return <Loading/>;
    }

    return (
        <SafeAreaView className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {availableWeekDays[weekDay]}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={progress} />

                <View className={clsx('mt-6', {
                    'opacity-50': isDateInPast
                })}>
                    {
                        habits?.length == 0
                        ? <EmptyHabit/>
                        : habits?.map(habit => {
                            return <Checkbox
                                onPress={() => toggleHabits(habit.id)}
                                key={habit.id}
                                title={habit.title}
                                checked={habit.completed}
                                disabled={isDateInPast}
                            />
                        })
                    }
                </View>

                {
                    isDateInPast && habits.length > 0 && (
                        <Text className="text-white mt-10 text-center">
                            Voce não pode editar um hábito passado
                        </Text>
                    )
                }

            </ScrollView>
        </SafeAreaView>
    );
}