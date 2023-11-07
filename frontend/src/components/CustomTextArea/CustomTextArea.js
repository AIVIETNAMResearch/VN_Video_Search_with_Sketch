import { Button } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/material/styles";
import "./CustomTextArea.css";
import React from "react";

const StyledTextarea = styled(TextareaAutosize)({
  width: '98%',
  padding: '12px',
  fontSize: '16px',
  border: '4px solid black',
  borderRadius: '4px',
  resize: 'vertical',
  transition: 'border-color 0.2s ease-in-out',
  '&:focus': {
    outline: 'none',
    borderColor: '#007bff',
  },
});


const CustomTextarea = ({ value, onChange, clearInput, onSubmit }) => {
 const handleSubmit = event => {
    event.preventDefault();
    console.log("submit copleted")
    onSubmit();
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <StyledTextarea
        onChange={(e) => onChange(e.target.value)}
          value={value}
          aria-label="textarea"
          placeholder="Enter your text to search..."
          onKeyDown={handleKeyDown}
        />

        <div className="button-container" >
          <Button variant="contained" color="primary" type="submit">
            Search
          </Button>
          <Button variant="contained" color="primary" onClick={clearInput}>
            Clear
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default CustomTextarea;
