import { useState } from 'react';
import ToggleButton from './ToggleButton';
import './ToggleButtonGroupStyle.css';

function ToggleButtonGroup({
    options = [],
    value,
    onChange,
    defaultValue,
    disabled = false
}) {
    const [internalValue, setInternalValue] = useState(defaultValue ?? null);

    const selectedValue = value !== undefined ? value : internalValue;

    function handleSelection(optionValue) {
        if (disabled) {
            return;
        }

        if (value === undefined) {
            setInternalValue(optionValue);
        }

        onChange?.(optionValue);
    }

    return (
        <div className="toggle-button-group" role="group">
            {options.map((option) => (
                <ToggleButton
                    key={option.value}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    variation={option.variation}
                    selected={selectedValue === option.value}
                    disabled={disabled || option.disabled}
                    onClick={() => handleSelection(option.value)}
                />
            ))}
        </div>
    );
}

export default ToggleButtonGroup;