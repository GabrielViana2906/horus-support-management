import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './SplitButtonStyle.css';

function SplitButton({ text, image, action, options = [], disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const containerRef = useRef(null);
    const menuRef = useRef(null);

    function toggleMenu() {
        if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();

            setPosition({
                top: rect.bottom,
                left: rect.left
            });
        }

        setIsOpen((previousState) => !previousState);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            const clickedButton = containerRef.current?.contains(event.target);
            const clickedMenu = menuRef.current?.contains(event.target);

            if (!clickedButton && !clickedMenu) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="split-button-container" ref={containerRef}>
            <button
                type="button"
                className="split-button-main"
                onClick={action}
                disabled={disabled}
            >
                {image && <img src={image} alt="" />}
                <span>{text}</span>
            </button>

            <button
                type="button"
                className="split-button-toggle"
                onClick={toggleMenu}
                disabled={disabled}
                aria-label={`Opções de ${text}`}
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                {isOpen ? '▴' : '▾'}
            </button>

            {isOpen && createPortal(
                <div
                    className="split-button-menu"
                    ref={menuRef}
                    role="menu"
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 99999
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className="split-button-option"
                            role="menuitem"
                            onClick={() => {
                                option.action?.();
                                setIsOpen(false);
                            }}
                            disabled={option.disabled ?? false}
                        >
                            {option.image && <img src={option.image} alt="" />}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}

export default SplitButton;