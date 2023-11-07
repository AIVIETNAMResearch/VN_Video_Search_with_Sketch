import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { Box, Checkbox, Drawer, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Modal, Typography, styled } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from 'react-router-dom';
import SubsequentSearch from "../SubsequentSearch/SubsequentSearch";
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';

function ImageDisplay({ subImages, setSubImages, selectedImages, setSelectedImages, imagesList, setImagesList}) {
  const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
      opacity: 0.8,
      border: `solid 5px red`,
    },
  }));

  const [inputQuery, setInputQuery] = useState('');
  const [imageLength, setImageLength] = useState(0);
  const [textSearch, setTextSearch] = useState(false);
  const [imagePerPage, setImagePerPage] = useState(32);
  const [clearPage, setClearPage] = useState(false);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(true);

  const [checkboxValues, setCheckboxValues] = useState({
    bothCheckbox: false,
    femaleCheckbox: false,
    maleCheckbox: false,
  });

  const [textFieldValues, setTextFieldValues] = useState({
    bothTextfield: 0,
    femaleTextfield: 0,
    maleTextfield: 0,
  });

  const handleCheckboxChange = (event) => {
    setCheckboxValues({
      ...checkboxValues,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTextFieldChange = (event) => {
    if (!event.target.value) {
      setTextFieldValues({
        ...textFieldValues,
        [event.target.name]: 0,
      });
    } else {
      setTextFieldValues({
        ...textFieldValues,
        [event.target.name]: parseInt(event.target.value),
      });
    }
  };

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
    setIsSubmitted(false);
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
        `http://localhost:5000/get_all_images/pages?page=1&page_size=20`
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
        `http://localhost:5000/get_all_images/pages?page=${page}&page_size=20`
      );
      console.log('image_response', response)
      setImagesList(response.data['result']);
      setImageLength(response.data['images_length'])

    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  const fetchTextSearch = async (inputValue) => {
    const params = { textquery: inputQuery }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {

      const totalValue = parseInt(textFieldValues.bothTextfield) || 0;
      const femaleValue = parseInt(textFieldValues.femaleTextfield) || 0;
      const maleValue = parseInt(textFieldValues.maleTextfield) || 0;

      if (checkboxValues.bothCheckbox) {
        if (femaleValue + maleValue <= totalValue) {
          const data = {
            checkboxes: checkboxValues,
            textfields: textFieldValues,
          };

          const response = await axios.post(
            `http://localhost:5000/home/main/textsearch?textquery=${inputQuery}`, data
          );
          setImagesList(response.data['result']);
          setImageLength(response.data['images_length'])
          setTextSearch(true);
          setClearPage(true);
          setIsSubmitted(true);
        } else {
          alert('The sum of "Female" and "Male" values exceeds "Total".');
        }
      }
      else {
        const data = {
          checkboxes: checkboxValues,
          textfields: textFieldValues,
        };

        const response = await axios.post(
          `http://localhost:5000/home/main/textsearch?textquery=${inputQuery}`, data
        );
        setImagesList(response.data['result']);
        setImageLength(response.data['images_length'])
        setTextSearch(true);
        setClearPage(true);
        setIsSubmitted(true);
      }


    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const fetchImageSearch = async (imageId) => {
    console.log(imageId);
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })


    try {
      const totalValue = parseInt(textFieldValues.bothTextfield) || 0;
      const femaleValue = parseInt(textFieldValues.femaleTextfield) || 0;
      const maleValue = parseInt(textFieldValues.maleTextfield) || 0;

      if (checkboxValues.bothCheckbox) {
        if (femaleValue + maleValue <= totalValue) {
          const data = {
            checkboxes: checkboxValues,
            textfields: textFieldValues,
          };

          const image_response = await axios.post(
            `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`, data
          );


          const sub_image_response = await axios.get(
            `http://localhost:5000/subimgsearch?imageId=${imageId}`
          )
          setImagesList(image_response.data['result']);
          setSubImages(sub_image_response.data['result']);

          console.log('checkdata', subImages)
          setPage(1);
        } else {
          alert('The sum of "Female" and "Male" values exceeds "Total".');
        }
      }
      else {
        const data = {
          checkboxes: checkboxValues,
          textfields: textFieldValues,
        };

        const image_response = await axios.post(
          `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`, data
        );


        const sub_image_response = await axios.get(
          `http://localhost:5000/subimgsearch?imageId=${imageId}`
        )
        setImagesList(image_response.data['result']);
        setSubImages(sub_image_response.data['result']);

        console.log('checkdata', subImages)
        setPage(1);
      }
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
      <IconButton
        aria-label="Subsequent Frames"
        onClick={toggleDrawer}
        style={{ color: 'blue' }}
      >
        <ImageSearchTwoToneIcon />
      </IconButton>
      <Typography variant="caption">Subsequent Frames</Typography>
      {isSubmitted ? (
        <div style={{ maxHeight: '700px', overflow: 'auto' }}>
          <Grid container sx={{ pt: 3, overflow: 'auto' }}>
            {console.log(imagesList)}
            {imagesList && imagesList.length > 0 ? (
              <div style={{ maxHeight: '600px', overflow: 'auto' }}>
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
              </div>
            ) : (
              null
            )}
          </Grid>
        </div>
      ) : null}

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
  )
}

export default ImageDisplay;
