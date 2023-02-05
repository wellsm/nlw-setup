import { useState } from 'react';

import * as CheckboxUI from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Check } from 'phosphor-react';

interface CheckboxProps extends CheckboxUI.CheckboxProps {
    title: string;
    isForm?: boolean;
    isChecked?: boolean;
}

export function Checkbox({ title, isForm = false, isChecked = false }: CheckboxProps) {
    const [checked, setChecked] = useState<CheckboxUI.CheckedState>(isChecked);

    return (
        <CheckboxUI.Root
            className="flex items-center gap-3 group"
        >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                <CheckboxUI.Indicator>
                    <Check size={20} className="text-white"/>
                </CheckboxUI.Indicator>
            </div>

            <span className={clsx('text-white leading-tight', {
                'font-semibold text-xl group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400': !isForm
            })}>
                {title}
            </span>
        </CheckboxUI.Root>
    )
}