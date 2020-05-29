import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { stories } from '/utils/fixtures';

export const useStyles = makeStyles({
    container: {
        display: 'flex',
        width: 360,
        marginBottom: 8,
    },
    select: {
        width: 200,
        marginRight: 12,
    },
});

const options = Object.keys(stories).map((category) => ({ label: category, value: category }));
const randomOption = { label: 'Random', value: 'Random' };
const allWords = Object.keys(stories).reduce((acc, category) => [...acc, ...stories[category]], []);

export const StorySelect = () => {
    const classes = useStyles();
    const [selected, setSelected] = useState(randomOption);
    const [word, setWord] = useState(null);
    const wordBank = selected === randomOption ? allWords : stories[selected.value];

    const onChange = (val) => setSelected(val);

    const generateWord = () => {
        setWord(wordBank[Math.floor(Math.random() * wordBank.length)]);
    };

    useEffect(() => {
        generateWord();
    }, [selected]);

    return (
        <>
            <div className={classes.container}>
                <Select
                    className={classes.select}
                    isSearchable
                    options={options}
                    value={selected}
                    onChange={onChange}
                />
                <Button size="small" variant="outlined" onClick={generateWord}>
                    Get new word
                </Button>
            </div>
            <h4>Story word: {word}</h4>
        </>
    );
};
