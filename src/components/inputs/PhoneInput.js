import React, { useState, useRef, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { isValidPhoneNumber } from 'libphonenumber-js';

const PhoneInput = ({
                        phone,
                        onChange,
                        name, // Make name required
                        label = 'Телефон',
                        placeholder = 'Добавьте номер телефона',
                    }) => {
    const [error, setError] = useState('');
    const labelRef = useRef(null);
    const [errorOffset, setErrorOffset] = useState(80); // Default fallback

    // Dynamically calculate label width for error positioning
    useEffect(() => {
        if (labelRef.current) {
            setErrorOffset(labelRef.current.offsetWidth + 10); // Label width + padding
        }
    }, [label]);

    const validatePhone = (value) => {
        if (value === '') {
            setError(''); // Clear error for empty input
            return true; // Allow empty input
        }
        if (!isValidPhoneNumber(value)) {
            setError('Неверный номер телефона');
            return false;
        }
        setError('');
        return true;
    };

    const handleChange = (value) => {
        const syntheticEvent = {
            target: {
                name,
                value,
            },
        };
        onChange(syntheticEvent);
        validatePhone(value);
    };

    // Use name to create unique IDs
    const inputId = `phone-${name}`;
    const errorId = `phoneError-${name}`;

    return (
        <div className="form-group">
            <div className="label-error-container">
                <label ref={labelRef} htmlFor={inputId}>{label}</label>
                {error && (
                    <div
                        id={errorId}
                        className="invalid-feedback"
                        style={{ left: `${errorOffset}px` }}
                    >
                        {error}
                    </div>
                )}
            </div>
            <IMaskInput
                mask="+7 (000) 000-00-00"
                value={phone}
                onAccept={handleChange}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                id={inputId}
                name={name}
                type="tel"
                aria-describedby={errorId}
            />
        </div>
    );
};

export default PhoneInput;