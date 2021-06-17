import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { authHeader, handleResponse } from './Login';


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

export default function EditDeleteTask(props) {
  let { taskId, getTaskFunc, updateTaskFunc } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [shortDescr, setShortDescr] = React.useState('');
  const [longDescr, setLongDescr] = React.useState('');
  const [expectedDate, setExpectedDate] = React.useState('');

  const handleShortDescrChange = (event) => {
    setShortDescr(event.target.value);
  };
  const handleLongDescrChange = (event) => {
    setLongDescr(event.target.value);
  };
  // const handleDateChange = (date) => {
  //   console.log(date);
  //   setExpectedDate(date);
  // };

  const handleSave = () => {
      // validate input
    postUpdatedTask(); //shortDescr, longDescr, expectedDate, onSuccess, onFailure);

   };

  const onSuccess = () => {
    updateTaskFunc();
    handleClose();
  }

  const postUpdatedTask = () => {
    // let expectedDateStr = new Intl.DateTimeFormat('en-US').format(expectedDate);
    let authHdr = authHeader();
    let fetchUrl = `/task/${taskId}`;
    let fetchOptions = {
      method: 'POST', 
      headers: {'Content-Type':'application/json', 'Authorization': authHdr.Authorization},
      body: JSON.stringify(
          {shortDescr: shortDescr, longDescr: longDescr})
    }
    fetch(fetchUrl, fetchOptions).then(response => response.json()).then(resp_obj => {
        handleResponse(resp_obj, onSuccess);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
  }

  useEffect(() => {
    let initTask = getTaskFunc();
    // console.log('EditDeleteTask useEffect', initTask);
    setShortDescr(initTask.short_descr);
    setLongDescr(initTask.long_descr);
    //setExpectedDate(new Date(initTask.expectedDate));
  }, [open]);

  return (
    <div>
      <ButtonGroup className={classes.body} variant="text" color="secondary" aria-label="text primary button group">
        <Button onClick={handleClickOpen}>Edit</Button>
        <Button>Delete</Button>
      </ButtonGroup>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Edit Task
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
