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

export default function NewCompanyDialog(props) {
    let { classId, projectId, setDataUpdatedFcn } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [companyName, setCompanyName] = React.useState('');

  const handleNameChange = (event) => {
    setCompanyName(event.target.value);
  };

  const handleSave = () => {
      // validate input
    postNewCompany(); 
   };

  const onSuccess = () => {
    setDataUpdatedFcn();
    handleClose();
  }

  const onFailure = () => {
    alert('onFailure called');
  }

  const postNewCompany = () => {
    fetch(`/customers`,
        {
            method: 'POST', 
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(
                {'name': companyName})
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
              Add Company
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
                    id="name" label="Company Name" fullWidth 
                    value={companyName} onChange={handleNameChange}
                />
            </div>
        </form>
        </Container>
      </Dialog>
    </div>
  );
}
