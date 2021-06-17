import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { UserToken } from './Login';
import Link from '@material-ui/core/Link';
import NewTaskDialog from './NewTaskDialog';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '8px',
        backgroundColor: theme.palette.grey[300],
    }
}));
    
export default function TaskList() {
    const classes = useStyles();
    const [taskList, setTaskList] = useState([]);
    const [version, setVersion] = useState(0);
    const [taskBreadcrumbName, setTaskBreadcrumbName] = useState('');
    let history = useHistory();

    const handleListItemClick = (event, taskId) => {
        console.log(`load details for task`);
        console.log(taskId);
        history.replace({ pathname: `/task/${taskId}` });
    };

    useEffect(() => {
        console.log('calling fetch with token ' + UserToken);
        let fetchOptions ={
            method : 'GET',
            headers: {'Authorization':'Bearer ' + UserToken}
        }
        fetch(`/tasks`,fetchOptions).then(res => res.json()).then(response => {
          console.log(response);
          setTaskList(response.data.tasks);
          console.log('Set task list with data from API call');
        })
    }, [version]); // tells React to call the useEffect function only when version changes.
    
    const setTaskListUpdated = () => {
        setVersion(version + 1);
    }
            
    return (
        <div className={classes.root}>
            <div className={classes.header}>               
                    <Typography variant="h6" color="textPrimary">Tasks</Typography>
            </div>
            <List component="nav" aria-label="list of tasks">
            {
            taskList.map((task, i) => {
              return (
                <ListItem button key={task} onClick={(event) => handleListItemClick(event, task.id)}>
                    <ListItemText primary={task.task} />
                </ListItem>
              );
            })
          }
            </List>
            <NewTaskDialog setDataUpdatedFcn={setTaskListUpdated}/>
        </div>
    );
}

