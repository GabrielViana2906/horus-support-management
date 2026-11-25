import './ToastStyle.css';

const TOAST_ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
};

function Toast({ message, type = 'info', duration = 3500, toastKey }) {
    if (!message) {
        return null;
    }

    const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

    return (
        <div
            key={toastKey}
            className={`app-toast ${type}`}
            role="status"
            aria-live="polite"
        >
            <div className="app-toast-content">
                <span className="app-toast-icon">{icon}</span>
                <span className="app-toast-message">{message}</span>
            </div>

            <div className="app-toast-progress-track">
                <div
                    className="app-toast-progress-bar"
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
}

export default Toast;
