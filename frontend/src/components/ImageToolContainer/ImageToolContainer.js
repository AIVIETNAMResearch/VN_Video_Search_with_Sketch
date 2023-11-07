import { Grid, IconButton, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useState } from "react";
import MainSearchContainer from '../MainSearchContainer/MainSearchContainer';
import OCRContainer from '../OCRContainer/OCRContainer';
import SketchContainer from '../SketchContainer/SketchContainer';
import ImageDisplay from '../ImageDisplay/ImageDisplay';
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ImageToolContainer({ selectedImages, setSelectedImages, subImages, setSubImages }) {
  const [value, setValue] = React.useState(0);
  const [imagesList, setImagesList] = useState([]);

  const handleChange = (evengt, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2} pt={2}>
      <Grid item xs={3} sm={3}>
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            height: '700px',
            backgroundColor: '#'
          }}
          style={{ padding: '20px' }}
        >
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                <Tab label="CLIP" {...a11yProps(0)} sx={{ color: 'black', fontWeight: 'bold' }} />
                <Tab label="Sketch" {...a11yProps(1)} sx={{ color: 'black', fontWeight: 'bold' }} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <MainSearchContainer subImages={subImages} setSubImages={setSubImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages} imagesList={imagesList} setImagesList={setImagesList}/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <SketchContainer subImages={subImages} setSubImages={setSubImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages} imagesList={imagesList} setImagesList={setImagesList} />
            </CustomTabPanel>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={9} sm={9}>
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            borderRadius: "8px",
            height: '700px',
            backgroundColor: '#'
          }}
          style={{ padding: '20px' }}
        >
          <ImageDisplay subImages={subImages} setSubImages={setSubImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages} imagesList={imagesList} setImagesList={setImagesList}/>
        </Paper>
      </Grid>
    </Grid >
  );
}