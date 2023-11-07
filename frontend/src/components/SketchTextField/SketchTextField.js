import { Button } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { styled } from "@mui/material/styles";
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


const SketchQueryField = ({ inputSketchQuery, setInputSketchQuery, setIsSubmitted}) => {
  const handleInputSketchQueryChange = (e) => {
    setIsSubmitted(false);

    setInputSketchQuery(e.target.value);
  }

  return (
    <React.Fragment>
      <StyledTextarea
        onChange={(e) => handleInputSketchQueryChange(e)}
        minRows={2}
        value={inputSketchQuery}
        aria-label="textarea"
        placeholder="Enter your text to search..."
      />
    </React.Fragment>
  );
};

export default SketchQueryField;
