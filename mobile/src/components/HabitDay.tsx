import clsx from "clsx";
import dayjs from "dayjs";

import { TouchableOpacity, TouchableOpacityProps, Dimensions } from "react-native";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

interface HabitDayProps extends TouchableOpacityProps {
    date?: Date,
    active?: boolean,
    completed?: number,
    amount?: number,
}

export function HabitDay({ date, active = true, completed = 0, amount = 0, ...props }: HabitDayProps) {
    const progress = generateProgressPercentage(amount, completed);
    const today = dayjs().startOf('day').toDate();

    const isToday = dayjs(date).isSame(today);

    return (
        <TouchableOpacity
            className={clsx('bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800', {
                'opacity-40': !active,
                'bg-zinc-900 border-zinc-800': progress === 0,
                'bg-violet-900 border-violet-800': progress > 0 && progress < 20,
                'bg-violet-800 border-violet-700': progress >= 20 && progress < 40,
                'bg-violet-700 border-violet-600': progress >= 40 && progress < 60,
                'bg-violet-600 border-violet-500': progress >= 60 && progress < 80,
                'bg-violet-500 border-violet-400': progress >= 80,
                'border-white border-4': isToday
            })}
            style={{
                width: DAY_SIZE,
                height: DAY_SIZE
            }}
            activeOpacity={0.7}
            {...props}
        />
    )
}