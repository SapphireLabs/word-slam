import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((_) => ({
    textField: {
        display: 'block',
    },
    button: {
        marginTop: 16,
        '&:not(:last-child)': {
            marginRight: 16,
        },
    },
    containerCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
    },
    linkPlain: {
        textDecoration: 'none',
        color: 'white',
    },
    sliderWrapper: {
        marginTop: 16,
        color: '#575757',
    },
    noBorder: {
        border: 'none',
    },
    stretch: {
        alignItems: 'stretch',
    },
    pointer: {
        cursor: 'pointer',
    },
    marginLeft8: {
        marginLeft: 8,
    },
    grey: {
        color: grey[700],
    },
    bold: {
        fontWeight: 'bold',
    },
    noMargin: {
        margin: 0,
    },
    player: {
        width: '100%',
        display: 'flex',
        background: grey[300],
        padding: 8,
        marginBottom: 8,
        fontSize: 10,
        alignItems: 'center',
    },
    header: {
        background: grey[400],
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 0.5,
    },
}));
