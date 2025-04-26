import React, { useState, useRef, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import {FiAlertCircle} from "react-icons/fi";

const PhoneInput = ({
                        phone,
                        onChange,
                        name,
                        label = 'Телефон',
                        placeholder = 'Добавьте номер телефона',
                        error,
                    }) => {
    const labelRef = useRef(null);
    const [errorOffset, setErrorOffset] = useState(80);

    useEffect(() => {
        if (labelRef.current) {
            setErrorOffset(labelRef.current.offsetWidth + 10);
        }
    }, [label]);

    const handleChange = (value) => {
        const syntheticEvent = {
            target: {
                name,
                value,
            },
        };
        onChange(syntheticEvent);
    };

    const inputId = `phone-${name}`;
    const errorId = `phoneError-${name}`;

    return (
        <div className="form-group">
            <div className="label-container">
                <label ref={labelRef} htmlFor={inputId}>{label}</label>
                {error && (
                    <div className="error-tooltip">
                        <FiAlertCircle className="tooltip-icon" />
                        <span className="tooltip-text">{error}</span>
                    </div>
                )}
            </div>
            <IMaskInput
                mask="+7 (000) 000-00-00"
                value={phone}
                onAccept={handleChange}
                className={`form-control ${error ? 'has-error' : ''}`}
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