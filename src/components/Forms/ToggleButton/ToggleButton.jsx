import './ToggleButtonStyle.css';

function ToggleButton({
    icon,
    title,
    description,
    onClick,
    selected = false,
    disabled = false,
    variation = 'default'
}) {
    return (
        <button
            type="button"
            className={`toggle-button ${variation} ${selected ? 'selected' : ''}`}
            onClick={onClick}
            aria-pressed={selected}
            disabled={disabled}
        >
            {icon && (
                <span className="toggle-button-icon">
                    {icon}
                </span>
            )}

            <strong>{title}</strong>

            {description && (
                <span className="toggle-button-description">
                    {description}
                </span>
            )}
        </button>
    );
}

export default ToggleButton;