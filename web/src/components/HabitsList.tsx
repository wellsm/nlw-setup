import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { API } from '../lib/axios';

interface HabitsListProps {
    date: Date,
    onCompletedChanged: (completed: number) => void
};

type Habits = Array<{
    id: string,
    title: string,
    created_at: string,
    completed: boolean
}>

export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
    const [habits, setHabits] = useState<Habits>([]);

    useEffect(() => {
        API.get('/day', {
            params: {
                date: date!.toISOString()
            }
        }).then(({ data: response }) => setHabits(response))
    }, []);

    async function toggleHabit(id: string) {
        await API.patch(`/habits/${id}/toggle`);

        const updatedHabits = habits.map(habit => ({ 
            ...habit,
            completed: habit.id === id ? !habit.completed : habit.completed
        }));

        const completed = updatedHabits.filter(habit => habit.completed).length;

        setHabits(updatedHabits);
        onCompletedChanged(completed);
    }

    const isDateInPast = dayjs(date)
        .endOf('day')
        .isBefore(new Date);

    return (
        <div className="mt-6 flex flex-col gap-3">
            {
                habits?.map(habit => {
                    return <Checkbox.Root
                            key={habit.id}
                            onCheckedChange={() => toggleHabit(habit.id)}
                            checked={habit.completed}
                            className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
                            disabled={isDateInPast}
                        >
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors
                                group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500
                                group-focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background">
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white"/>
                                </Checkbox.Indicator>
                            </div>
            
                            <span className="text-white leading-tight font-semibold text-xl group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                                {habit.title}
                            </span>
                        </Checkbox.Root>
                })
            }
        </div>
    )
}