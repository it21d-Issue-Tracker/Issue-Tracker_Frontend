import { useEffect, useRef } from 'react';

export default function CaracteristicaSelect({ field, label, options, value, onChange }) {
    const colorRef = useRef();

    useEffect(() => {
        const selected = options.find(o => o.name === value);
        if (selected && colorRef.current) {
            colorRef.current.style.backgroundColor = selected.color;
        }
    }, [value, options]);

    return (
        <div className="caracteristica-container">
            <label className="caracteristica-label" htmlFor={field}>{label}:</label>
            <div className="caracteristica-select-container">
                <select
                    name={field}
                    id={field}
                    value={value}
                    onChange={onChange}
                    className="caracteristica-select"
                >
                    {options.map(option => (
                        <option key={option.id} value={option.name} data-color={option.color}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <span ref={colorRef} className="caracteristica-color"></span>
            </div>
        </div>
    );
}
