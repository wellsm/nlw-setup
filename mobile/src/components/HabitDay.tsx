import { TouchableOpacity, Dimensions } from "react-native";

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

type HabitDayProps = {
    active?: boolean
}

export function HabitDay({ active = true }: HabitDayProps) {
    return (
        <TouchableOpacity
            className={`bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800
                ${active ? '' : 'opacity-40'}
            `}
            style={{
                width: DAY_SIZE,
                height: DAY_SIZE
            }}
            activeOpacity={0.7}
        />
    )
}