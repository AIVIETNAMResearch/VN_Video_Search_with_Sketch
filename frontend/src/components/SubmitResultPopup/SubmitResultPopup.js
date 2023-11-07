import { SnackbarProvider, useSnackbar } from 'notistack';
import * as React from 'react';


function SubmitResultPopup({ submitResponseMessage }) {
  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    console.log('message', submitResponseMessage )

    if (submitResponseMessage) {
      submitResponseMessage.forEach((message) => {
        if (message.status === 412) {
          enqueueSnackbar(message.description, { variant: message.variant });
        } else if (message.status === 200){
        if(message.submission === "WRONG"){
            enqueueSnackbar(message.description, { variant: message.variant });
          } else{
            enqueueSnackbar(message.description, { variant: message.variant });
          }
        }
      });
    }

  }, [enqueueSnackbar, submitResponseMessage])
  return null;
}

export default function IntegrationNotistack({ submitResponseMessage, setSubmitResponseMessage }) {

  return (
    <SnackbarProvider maxSnack={20}>
      <SubmitResultPopup submitResponseMessage={submitResponseMessage} />
    </SnackbarProvider>
  );
}
