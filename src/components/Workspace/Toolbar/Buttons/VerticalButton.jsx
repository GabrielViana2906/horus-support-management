import './VerticalButtonStyle.css';

function VerticalButton({ text, image, action, disabled = false }) {
    return (
        <button
            type="button"
            className="v-button"
            onClick={action}
            disabled={disabled}
        >
            <img src={image} alt="" />
            <span>{text}</span>
        </button>
    );
}

export default VerticalButton;