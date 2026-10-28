import './HorizontalButtonStyle.css';

function HorizontalButton({ text, image, action, disabled = false }) {
    return (
        <button
            type="button"
            className="horizontal-button"
            onClick={action}
            disabled={disabled}
        >
            <img src={image} alt="" />
            <span>{text}</span>
        </button>
    );
}

export default HorizontalButton;