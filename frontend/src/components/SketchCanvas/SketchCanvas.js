import { Button, Grid } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
  border: "3px solid black",
  borderRadius: "0.25rem",
  height: "200px",
  width: "100%"
};

function SketchCanvas({inputSketchQuery, imagesList, setImagesList, checkboxValues, textFieldValues, setIsSubmitted}) {
  const canvasRef = React.useRef(null);

  const searchSketch = async () => {
    canvasRef.current.exportImage("jpg").then(data => {
      const sketchData = { 'sketchData': data, 'query': inputSketchQuery, 'checkboxes': checkboxValues,
      'textfields': textFieldValues}
      axios.post(
        `http://localhost:5000/process_sketch`
        , sketchData, {
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => {
        setImagesList(response.data['result']);
        setIsSubmitted(true);
      }).catch(error => {
        console.log('error', error)
      })

    });
  }

  return (
    <Grid container spacing={2} pt={5}>
      <ReactSketchCanvas
        style={styles}
        ref={canvasRef}
        strokeColor='black'
      />

      <div className="button-container" >
        <Button variant="contained" color="primary" onClick={searchSketch}>
          Search Sketch
        </Button>
        <Button variant="contained" color="primary" onClick={() => {
          canvasRef.current.clearCanvas()
        }}>
          Clear
        </Button>
      </div>
    </Grid>
  );
};

export default SketchCanvas;