import React, { Fragment, useContext, useEffect } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import AlertContext from '../../context/alert/AlertState';

const Alert = () => {
  const alertContext = useContext(AlertContext);
  const { alerts, removeAlert } = alertContext;

  const handleClose = (event, reason, id) => {
    if (reason === 'clickaway') {
      return;
    }
    removeAlert(id);
  };

  return (
    <Fragment>
      {alerts.length > 0 &&
        alerts.map(alert => (
          <Snackbar
            key={alert.id}
            open={true}
            autoHideDuration={6000}
            onClose={(e, reason) => handleClose(e, reason, alert.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 6 }}
          >
            <MuiAlert
              onClose={() => handleClose(null, null, alert.id)}
              severity={alert.type}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alert.msg}
            </MuiAlert>
          </Snackbar>
        ))}
    </Fragment>
  );
};

export default Alert;
