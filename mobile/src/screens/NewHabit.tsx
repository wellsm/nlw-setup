import { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { API } from '../lib/axios';

import colors from 'tailwindcss/colors'

const availableWeekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
];

export function NewHabit() {
    const [title, setTitle] = useState<string>('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    function toggleWeekDay(weekDaySelected: number) {
        return weekDays.includes(weekDaySelected)
            ? setWeekDays(prevState => prevState.filter(weekDay => weekDay != weekDaySelected))
            : setWeekDays(prevState => [...prevState, weekDaySelected]);
    }

    async function createNewHabit() {
        if (!title.trim() || weekDays.length === 0) {
            return;
        }

        try {
            await API.post('/habits', {
                title,
                weekDays
            });
        } catch (err) {
            console.log(err);
        }

        setTitle('');
        setWeekDays([]);
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton/>

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar Hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-500"
                    placeholder="Fazer Exercício, Passear com o Dog, etc..."
                    placeholderTextColor={colors.zinc[400]}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <Checkbox
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(index)}
                            onPress={() =>  toggleWeekDay(index)}
                        />
                    ))
                }

                <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    onPress={createNewHabit}
                >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}