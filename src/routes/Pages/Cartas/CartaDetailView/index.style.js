import { lighten, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    minWidth: "600px",
    marginBottom: theme.spacing(4),
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
  },
  container: {
    maxHeight: 400,
  },
  table: {
    minWidth: 400,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

  dialogRoot: {
    position: 'relative',
  },
  dialogTitleRoot: {
    '& .MuiTypography-h6': {
      fontSize: 16,
      color: theme.palette.common.dark,
    },
  },  
}));

export default useStyles;
