import React, { useState } from 'react';
import T from 'prop-types';
import Select from 'react-select';

import { clues } from '/utils/fixtures';
import { ClueCard } from './ClueCard';

const optionsMap = Object.keys(clues).reduce((map, type) => {
    map[type] = clues[type].map((word) => ({ label: word, value: word }));

    return map;
}, {});

export const ClueSelect = ({ className, type }) => {
    const options = optionsMap[type];
    const [selected, setSelected] = useState(options[0]);

    const onChange = (val) => setSelected(val);

    const onClickLeft = () => {
        const i = options.findIndex((o) => o.value === selected.value);

        setSelected(options[!i ? options.length - 1 : i - 1]);
    };

    const onClickRight = () => {
        const i = options.findIndex((o) => o.value === selected.value);

        setSelected(options[i === options.length - 1 ? 0 : i + 1]);
    };

    return (
        <div className={className}>
            <Select
                className={`ClueSelect--${type}`}
                isSearchable
                options={options}
                value={selected}
                onChange={onChange}
            />
            {/* Make draggable card */}
            <ClueCard
                label={selected.label}
                type={type}
                onClickLeft={onClickLeft}
                onClickRight={onClickRight}
            />
        </div>
    );
};

ClueSelect.propTypes = {
    className: T.string,
    type: T.oneOf(Object.keys(clues)),
};
