import { ImageListItem, styled } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import FilterObjectDetection from "../FilterObjectDetection/FilterObjectDetection";
import SketchCanvas from "../SketchCanvas/SketchCanvas";
import SketchQueryField from "../SketchTextField/SketchTextField";
import ".//SketchContainer.css";


function SketchContainer({ subImages, setSubImages, selectedImages, setSelectedImages, imagesList, setImagesList}) {
  const [imageLength, setImageLength] = useState(0);
  const [imagePerPage, setImagePerPage] = useState(32);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState({});
  const [open, setOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = useState(true);
  const [inputSketchQuery, setInputSketchQuery] = useState('');
  const navigate = useNavigate();



  const toggleDrawer = () => {
    console.log(drawerOpen);
    setDrawerOpen(!drawerOpen);
  };

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

  const handleClose = () => {
    setOpen(false);
    setExpandedImage({});
  }

  const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
    "&:hover": {
      cursor: "pointer",
      opacity: 0.8,
      border: `solid 5px red`,
    },
  }));

  const handleExpandImage = (imageId, filename, imageData) => {
    setOpen(true);
    setExpandedImage({ id: imageId, filename: filename, image_data: imageData });
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
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  return (
    <div>
      <SketchQueryField inputSketchQuery={inputSketchQuery} setInputSketchQuery={setInputSketchQuery} setIsSubmitted={setIsSubmitted} />
      <FilterObjectDetection checkboxValues={checkboxValues} textFieldValues={textFieldValues} handleCheckboxChange={handleCheckboxChange} handleTextFieldChange={handleTextFieldChange} />
      <SketchCanvas inputSketchQuery={inputSketchQuery} imagesList={imagesList} setImagesList={setImagesList} checkboxValues={checkboxValues} textFieldValues={textFieldValues} setIsSubmitted={setIsSubmitted} />
    </div>
  )
}

export default SketchContainer;