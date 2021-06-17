import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import { authHeader, handleResponse } from './Login';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import EditDeleteTask from './EditDeleteTask';


function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

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
    },
    body: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '8px',
    },
    footer: {
      paddingLeft: '16px',
      paddingRight: '16px',
  }
}));
    
export default function TaskView() {
    const classes = useStyles();
    const loadingTask = {longDescr:'Loading'};
    const [task, setTask] = useState(loadingTask);
    const [version, setVersion] = useState(0);

    let history = useHistory();
    let { taskId } = useParams();
    // console.log(taskId);

    const handleTaskClick = () => {
        history.replace('/listings');
    }

    // const handleClassClick = () => {
    //     history.replace(`/projects/${classId}`);
    // }

    
    // const handleProjectClick = () => {
    //     history.replace(`/tasks/${classId}/${projectId}`);
    // };

    useEffect(() => {
        let fetchUrl = `/task/${taskId}`;
        // console.log(taskId);
        let fetchOptions = {
            method: 'GET', 
            headers: authHeader()        
        };
        fetch(fetchUrl, fetchOptions).then(res => res.json()).then(response => {
            handleResponse(response, responseData => {
                setTask(responseData.tasks);
                // setTaskBreadcrumbName(responseData.task.shortDescr);
                // setProjectBreadcrumbName(responseData.projectName);
                // setClassBreadcrumbName(responseData.className);    
            });
        })
    }, [version]); // tells React to call the useEffect function only when version changes.
    
    const getTask = () => {
        return task;
    }

    const setTaskUpdated = () => {
      setVersion(version + 1);
    }
            
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link variant="h6" color="inherit" href="#" onClick={handleTaskClick}>
                        Task
                    </Link>
                </Breadcrumbs>
            </div>
            <Typography className={classes.body} variant="body1" color="textPrimary">{task.long_descr}</Typography>
            <Divider />
            {/* <Typography className={classes.body} variant="body1" color="textSecondary">{`Expected ${task.expectedDate}`}</Typography>
            <Divider /> */}
            <div className={classes.footer}>
              <EditDeleteTask
                taskId={taskId}
                getTaskFunc={getTask} updateTaskFunc={setTaskUpdated} />
            </div>
        </div>
    );
}

