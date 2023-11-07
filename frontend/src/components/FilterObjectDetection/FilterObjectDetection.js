import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

function FilterObjectDetection({checkboxValues, textFieldValues, handleCheckboxChange, handleTextFieldChange}) {
  

  
  return (
    <div>
      <FormGroup>
        <Grid container spacing={2} pt={2}>
          {['Female', 'Male', 'Both'].map((checkboxName) => (
            <Grid item xs={12} sm={12} lg={12} key={checkboxName}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxValues[`${checkboxName.toLowerCase()}Checkbox`]}
                    onChange={handleCheckboxChange}
                    name={`${checkboxName.toLowerCase()}Checkbox`}
                    color="primary"
                  />
                }
                label={
                  <>
                    <Typography variant="body1">{checkboxName}</Typography>
                    <TextField
                      disabled={!checkboxValues[`${checkboxName.toLowerCase()}Checkbox`]}
                      value={textFieldValues[`${checkboxName.toLowerCase()}Textfield`]}
                      onChange={handleTextFieldChange}
                      name={`${checkboxName.toLowerCase()}Textfield`}
                      label="Type a number"
                      variant="outlined"
                      type="number"
                    />
                  </>
                }
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </div>
  );
}

export default FilterObjectDetection;
