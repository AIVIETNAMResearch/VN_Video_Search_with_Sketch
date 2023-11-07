import { Box, Checkbox, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Modal, Pagination, Typography, styled } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from 'react-router-dom';
import CustomTextarea from "../CustomTextArea/CustomTextArea";

import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';

import {
  Drawer
} from "@mui/material";
import SubsequentSearch from "../SubsequentSearch/SubsequentSearch";

const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    border: `solid 5px red`,
  },
}));

function OCRContainer({ subImages, setSubImages, selectedImages, setSelectedImages }) {
  const [inputQuery, setInputQuery] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const [imageLength, setImageLength] = useState(0);
  const [textSearch, setTextSearch] = useState(false);
  const [imagePerPage, setImagePerPage] = useState(32);
  const [clearPage, setClearPage] = useState(false);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState({});

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setExpandedImage({});
  }

  const styledModel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const handleInputQueryChange = (value) => {
    setInputQuery(value);
  }

  const clearInputQuery = () => {
    setInputQuery('')
  }

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get_all_images/pages?page=1&page_size=28`
      );
      setImagesList(response.data['result']);
      setImageLength(response.data['images_length'])
      setImagePerPage(28)
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const handleExpandImage = (imageId, filename, imageData) => {
    setOpen(true);
    setExpandedImage({ id: imageId, filename: filename, image_data: imageData });
  }

  const handleChangePage = (event, newPage) => {
    if (clearPage) {
      setPage(1);
    }
    else {
      setPage(newPage);
    }
    updateFetchImages(newPage);
  };

  const updateFetchImages = async (page) => {
    if (textSearch) {
      return
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/get_all_images/pages?page=${page}&page_size=28`
      );
      console.log('image_response', response)
      setImagesList(response.data['result']);
      setImageLength(response.data['images_length'])

    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const fetchImagesQueryData = async (inputValue) => {
    const params = { textquery: inputQuery }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const response = await axios.get(
        `http://localhost:5000/home/main/textsearch?textquery=${inputQuery}`
      );
      setImagesList(response.data['result']);
      setImageLength(response.data['images_length'])
      setTextSearch(true);
      setClearPage(true);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const fetchImageSearch = async (imageId, filename) => {
    console.log(imageId);
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })


    try {
      const image_response = await axios.get(
        `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`
      );
      const sub_image_response = await axios.get(
        `http://localhost:5000/subimgsearch?imageId=${imageId}`
      )
      setImagesList(image_response.data['result']);
      setSubImages(sub_image_response.data['result']);

      console.log('checkdata', subImages)
      setPage(1);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const toggleImageSelection = (id, imageData, imageTitle) => {
    setSelectedImages((prevSelectedImages) => {
      const isSelected = prevSelectedImages.some((image) => image._id === id);

      if (isSelected) {
        // If the image with the given ID is already selected, remove it
        return prevSelectedImages.filter((image) => image._id !== id);
      } else {
        // If the image is not selected, add it

        const imgObj = {
          _id: id,
          image_data: imageData,
          filename: imageTitle
        };
        return [...prevSelectedImages, imgObj];
      }
    });
  };


  const isImageSelected = (imageId) => {
    return selectedImages.some((image) => image._id === imageId);
  };

  return (
    <div>
      <CustomTextarea value={inputQuery} onChange={handleInputQueryChange} clearInput={clearInputQuery} onSubmit={fetchImagesQueryData} />
      <IconButton
        aria-label="Subsequent Frames"
        onClick={toggleDrawer}
        style={{ color: 'blue' }}
      >
        <ImageSearchTwoToneIcon />
      </IconButton>
      <Typography variant="caption">Subsequent Frames</Typography>
      <Grid container sx={{ pt: 3, overflow: 'auto' }}>
        {imagesList && imagesList.length > 0 ? (
          <ImageList sx={{ width: 'auto', height: 'auto' }} cols={8} rowHeight={'auto'} >
            {imagesList.map((image) => (
              <ImageListItemWithStyle key={image["_id"]} className={`${isImageSelected(image["_id"]) ? 'selectedImage' : ''}`}>
                <ImageListItemBar
                  title={image.filename.replace("images/keyframes/", "")}
                  position="top"
                  actionIcon={
                    <IconButton
                      aria-label={`Delete ${image.filename}`}
                      onClick={() => handleExpandImage(image._id, image.filename, image.image_data)}
                    >
                      <AspectRatioIcon sx={{ color: 'white' }} />
                    </IconButton>
                  }
                />
                <Grid item>
                  <Checkbox
                    checked={isImageSelected(image._id)}
                    onChange={() => toggleImageSelection(image['_id'], image['image_data'], image['filename'])}
                  />
                </Grid>
                <img
                  onClick={() => fetchImageSearch(image['_id'], image['filename'])}
                  style={{ cursor: 'pointer' }}
                  src={`data:image/jpeg;base64,${image['image_data']}`}
                  alt={`not found -${image['filename']}`}
                />
              </ImageListItemWithStyle>
            ))}
          </ImageList>
        ) : (
          null
        )}
      </Grid>

      {Object.keys(expandedImage).length > 0 && <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >

        <Box
          sx={{
            ...styledModel,
            width: 'auto',
            height: 'auto',
          }}
        >
          <ImageListItemBar
            // title={expandedImage['filename'].replace("images/keyframes/", "")}
            position="top"
          />
          <img
            style={{ cursor: 'pointer', width: 'auto', height: 'auto' }}
            src={`data:image/jpeg;base64,${expandedImage.image_data}`}
            loading="lazy"
            alt={`not found -${expandedImage.filename}`}
          />
        </Box>
      </Modal>
      }
      <Grid container justifyContent="center" alignItems="center">
        <Pagination
          count={Math.ceil(imageLength / imagePerPage)}
          color="primary"
          showFirstButton showLastButton
          page={page}
          onChange={handleChangePage}
        />
      </Grid>


      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box
          sx={{
            width: 900, // Set the width of the drawer as per your design
            padding: 2,
          }}
        >
          <SubsequentSearch subImages={subImages} selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
        </Box>
      </Drawer>

    </div>
  );
}

export default OCRContainer;
