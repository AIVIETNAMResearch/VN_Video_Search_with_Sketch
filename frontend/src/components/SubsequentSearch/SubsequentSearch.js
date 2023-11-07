import styled from "@emotion/styled";
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    border: `solid 4px red`,
  },
}));

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


function SubsequentSearch({ subImages, selectedImages, setSelectedImages }) {
  console.log('subimages', subImages)
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setExpandedImage({});
  }
  const [expandedImage, setExpandedImage] = useState({});

  useEffect(() => {
  }, []);

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

  const handleExpandImage = (imageId, filename, imageData) => {
    setOpen(true);
    setExpandedImage({ id: imageId, filename: filename, image_data: imageData });
  }


  const isImageSelected = (imageId) => {
    return selectedImages.some((image) => image._id === imageId);
  };

  if (subImages !== undefined) {
    return (
      <React.Fragment>
        <ImageList sx={{ width: 'auto', height: 'auto' }} cols={4}>
          {subImages.map((image) => (
            <ImageListItemWithStyle key={image['_id']} className={`${isImageSelected(image["_id"]) ? 'selectedImage' : ''}`}>
              <Grid item>
                <Checkbox
                  checked={isImageSelected(image._id)}
                  onChange={() => toggleImageSelection(image['_id'], image['image_data'], image['filename'])}
                />
              </Grid>
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
              <img
                src={`data:image/jpeg;base64,${image['image_data']}`}
                alt={image._id}
                loading="la
                zy"
              />
            </ImageListItemWithStyle>
          ))}
        </ImageList>
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
      </React.Fragment>
    );
  }

}

export default SubsequentSearch;
