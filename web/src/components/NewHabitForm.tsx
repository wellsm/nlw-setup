import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";

import * as Checkbox from '@radix-ui/react-checkbox';
import { API } from "../lib/axios";

const availableWeekDays = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
];

export function NewHabitForm() {
    const [title, setTitle] = useState<string>('');
    const [weekDays, setWeekDays] = useState<number[]>([]);

    async function createNewHabit(event: FormEvent) {
        event.preventDefault();

        if (!title || weekDays.length === 0) {
            return;
        }

        await API.post('/habits', {
            title,
            weekDays
        });

        setTitle('');
        setWeekDays([]);
    }

    function toggleWeekDay(weekDaySelected: number) {
        return weekDays.includes(weekDaySelected)
            ? setWeekDays(prevState => prevState.filter(weekDay => weekDay != weekDaySelected))
            : setWeekDays(prevState => [...prevState, weekDaySelected]);
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>

            <input
                type="text"
                id="title"
                placeholder="ex: Fazer Exercícios, Passear com o Cachorro, etc..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência
            </label>

            {
                availableWeekDays.map((weekDay, index) => (
                    <div className="flex flex-col gap-2 mt-3" key={weekDay}>
                        <Checkbox.Root
                            checked={weekDays.includes(index)}
                            className="flex items-center gap-3 group focus:outline-none"
                            onCheckedChange={() => toggleWeekDay(index)}
                        >
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors
                                group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500
                                group-focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background">
                                <Checkbox.Indicator>
                                    <Check size={20} className="text-white"/>
                                </Checkbox.Indicator>
                            </div>

                            <span className="text-white leading-tight">
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    </div>
                ))
            }

            <button
                type="submit"
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 transition-colors
                    hover:bg-green-500
                    focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
                <Check size={20} weight="bold"/>
                Confirmar
             </button>
        </form>
    )
}