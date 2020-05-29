import React from 'react';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';

import { useStoryWord } from '/imports/ui/core/hooks';

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
    sub: {
        fontSize: 14,
        fontWeight: 600,
        color: grey[700],
    },
});

export const StorySelect = () => {
    const classes = useStyles();
    const { options, category, setCategory, word, generateWord } = useStoryWord();

    const onChange = (val) => setCategory(val);

    return (
        <>
            <div className={classes.container}>
                <Select
                    className={classes.select}
                    isSearchable
                    options={options}
                    value={category}
                    onChange={onChange}
                />
                <Button size="small" variant="outlined" onClick={generateWord}>
                    Get new word
                </Button>
            </div>
            <h4>
                <span className={classes.sub}>Story word:</span> {word}
            </h4>
        </>
    );
};
