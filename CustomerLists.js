import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { UserToken } from './Login';
import NewCompanyDialog from './NewCompanyDialog';

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

// function loadClassProjects(classId) {
//     console.log(`load projects for class ${classId}`);
//     let history = useHistory();
//     history.replace({ pathname: `/classes/${classId}` });
// }


    
export default function ClassList() {
    const classes = useStyles();
    const [classList, setClassList] = useState([]);
    const [version, setVersion] = useState(0);
    let history = useHistory();

    const handleListItemClick = (event, companies) => {
        history.replace({ pathname: `/listings/${companies}` });
    };    

    useEffect(() => {
        console.log('calling fetch with token ' + UserToken);
        let fetchOptions ={
            method : 'GET',
            headers: {'Authorization':'Bearer ' + UserToken}
        }
        fetch('/customers', fetchOptions).then(res => res.json()).then(response => {
          console.log('got data');
          console.log(response);
          if (response.status == "success")
          {
            setClassList(response.data.customers);
          }
          else{
              alert (response.data.data)
          }
        })
      }, [version]);

      const setCompanyListUpdated = () => {
        setVersion(version + 1);
    }
            
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                    <Typography variant="h6" color="textPrimary">Customers</Typography>
            </div>
            <List component="nav" aria-label="list of customers">
            {
            classList.map((companies, i) => {
              return (
                <ListItem button key={companies} onClick={(event) => handleListItemClick(event, companies.id)}>
                    <ListItemText primary={companies.Company} />
                </ListItem>
              );
            })
          }
            </List>
            <NewCompanyDialog setDataUpdatedFcn={setCompanyListUpdated}/>
        </div>
    );
}