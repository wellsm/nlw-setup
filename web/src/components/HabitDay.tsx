import * as Popover from '@radix-ui/react-popover';

import { ProgressBar } from './ProgressBar';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { HabitsList } from './HabitsList';
import { useState } from 'react';

interface HabitDayProps {
    date?: Date,
    defaultCompleted?: number,
    amount?: number,
    active?: boolean
};

export function HabitDay({ date, defaultCompleted = 0, amount = 0, active = true }: HabitDayProps) {
    const [completed, setCompleted] = useState<number>(defaultCompleted);

    const progress = amount > 0 ? Math.round((completed / amount) * 100) : 0;
    const dayAndMonth = dayjs(date).format('DD/MM');
    const weekDay = dayjs(date).format('dddd');

    function onCompletedHabitsChanged(completed: number) {
        setCompleted(completed);
    }

    return (
        <Popover.Root>
            <Popover.Trigger className={clsx('w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background', {
                'opacity-40 cursor-not-allowed': !active,
                'bg-zinc-900 border-zinc-800': progress === 0,
                'bg-violet-900 border-violet-800': progress > 0 && progress < 20,
                'bg-violet-800 border-violet-700': progress >= 20 && progress < 40,
                'bg-violet-700 border-violet-600': progress >= 40 && progress < 60,
                'bg-violet-600 border-violet-500': progress >= 60 && progress < 80,
                'bg-violet-500 border-violet-400': progress >= 80,
            })}/>

            <Popover.Portal>
                <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
                    <span className="font-semibold text-zinc-400">{weekDay}</span>
                    <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

                    <ProgressBar progress={progress}/>

                    <HabitsList
                        date={date ?? new Date}
                        onCompletedChanged={onCompletedHabitsChanged}
                    />

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900"/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}