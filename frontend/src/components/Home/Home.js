import {
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React, { useState } from "react";
import BasicTabs from "../ImageToolContainer/ImageToolContainer";
import ImagePicker from "../ImagePicker/ImagePicker";
import ImageDisplay from "../ImageDisplay/ImageDisplay";
import ImageToolContainer from "../ImageToolContainer/ImageToolContainer";

function Home() {
  const [subImages, setSubImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  console.log('home-selectd-images-picker', selectedImages)

  return (
    <div>
      <Typography
        component="p"
        variant="h3"
        fontSize="bold"
        color="#FFAE42"
        align="center"
        fontFamily="Valorax"
      >
        Image Text Retrieval
      </Typography>
      <Grid container spacing={2} >
        <Grid item xs={12} sm={12}>
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              height: '450px',
              backgroundColor: '#'
            }}
            style={{ padding: '20px' }}
          >
            <ImagePicker selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
          </Paper>
        </Grid>
      </Grid>
      <ImageToolContainer selectedImages={selectedImages} setSelectedImages={setSelectedImages} subImages={subImages} setSubImages={setSubImages} />
    </div>
  );
}

export default Home;
