interface HabitDayProps {
    completed?: number,
    active?: boolean
};

export function HabitDay({ completed, active = true }: HabitDayProps) {
    return (
        <div className={`w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg
            ${active ? '' : 'opacity-40 cursor-not-allowed'}
        `}></div>
    )
}