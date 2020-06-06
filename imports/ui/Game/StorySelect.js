import React from 'react';
import { get } from 'lodash';
import Select from 'react-select';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';

import { useGameContext } from '/imports/ui/core/context';
import { stories } from '/utils/fixtures';
import { generateWord } from '/utils/game';

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
    overflow: {
        overflow: 'visible',
    },
    edit: {
        cursor: 'pointer',
        marginLeft: 4,
        verticalAlign: 'top',
    },
});

const toOption = (val) => ({ label: val, value: val });
const options = [...Object.keys(stories).map(toOption), { label: 'Random', value: 'Random' }];

export const StorySelect = () => {
    const classes = useStyles();
    const { currentRound } = useGameContext();
    const [open, setOpen] = React.useState(false);

    const onChange = (category) => {
        generateWord(currentRound, category);
    };

    const onClick = () => {
        generateWord(currentRound);
    };

    const toggleOpen = () => setOpen(!open);

    return (
        <div>
            <h3>
                Story word: {currentRound && currentRound.word}
                <CreateIcon className={classes.edit} onClick={toggleOpen} fontSize="small" />
            </h3>
            <Dialog classes={{ paper: classes.overflow }} open={open} onClose={toggleOpen}>
                <DialogTitle id="form-dialog-title">Storyteller options</DialogTitle>
                <DialogContent className={classes.overflow}>
                    <DialogContentText>
                        Pick a category and word you like and start the round.
                    </DialogContentText>
                    <div className={classes.container}>
                        <Select
                            className={classes.select}
                            isSearchable
                            options={options}
                            value={get(currentRound, 'category')}
                            onChange={onChange}
                        />
                        <Button size="small" variant="outlined" onClick={onClick}>
                            Get new word
                        </Button>
                    </div>
                    <h4>
                        <span className={classes.sub}>Story word:</span> {get(currentRound, 'word')}
                    </h4>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOpen} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
