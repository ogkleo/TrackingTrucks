import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewTaskDialog(props) {
    let { classId, projectId, setDataUpdatedFcn } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const nowInMillis = (new Date()).getTime();
  const millisInWeek = 7 * 24 * 60 * 60 * 1000;
  const aWeekFromNowInMillis = nowInMillis + millisInWeek;
  const aWeekFromNow = (new Date()).setTime(aWeekFromNowInMillis);

  const [shortDescr, setShortDescr] = React.useState('');
  const [longDescr, setLongDescr] = React.useState('');
  const [expectedDate, setExpectedDate] = React.useState(aWeekFromNow);

  const handleShortDescrChange = (event) => {
    setShortDescr(event.target.value);
  };
  const handleLongDescrChange = (event) => {
    setLongDescr(event.target.value);
  };
  const handleDateChange = (date) => {
    setExpectedDate(date);
  };

  const handleSave = () => {
      // validate input
    postNewTask(); //shortDescr, longDescr, expectedDate, onSuccess, onFailure);
   };

  const onSuccess = () => {
    setDataUpdatedFcn();
    handleClose();
  }

  const onFailure = () => {
    alert('onFailure called');
  }

  const postNewTask = () => {
    let expectedDateStr = new Intl.DateTimeFormat('en-US').format(expectedDate);
    console.log(expectedDateStr);
    fetch(`/task`,
        {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(
                {'shortDescr': shortDescr, 'longDescr': longDescr})
        })
        .then(response => response.json())
        .then(resp_obj => {
            // console.log(resp_obj);
            let status = resp_obj.status;
            if (status === 'success') {
                onSuccess(resp_obj.data);
            } else {
                onFailure(resp_obj.data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Add Task
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSave}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField 
                    id="shortDescr" label="Short Description" fullWidth 
                    value={shortDescr} onChange={handleShortDescrChange}
                />
            </div>
            <div>
                <TextField
                    id="longDescr" label="Long Description" fullWidth multiline rows={4}
                    value={longDescr} onChange={handleLongDescrChange}
                />
            </div>
            {/* <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker fullWidth
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="expectedBy"
                        label="Expected-By Date"
                        value={expectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div> */}
        </form>
        </Container>
      </Dialog>
    </div>
  );
}
