import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, TextField, styled } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import SubmitConfirmationPopup from "../SubmitConfirmation/SubmitConfirmation";
import IntegrationNotistack from "../SubmitResultPopup/SubmitResultPopup";


const ImageListItemWithStyle = styled(ImageListItem)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
  },
}));

function ImagePicker({ selectedImages, setSelectedImages }) {
  console.log('image-picker-images', selectedImages)
  const [subFileName, setSubFileName] = useState('');
  const [openSubmitPopup, setOpenSubmitPopup] = useState(false);
  const [submitResponseMessage, setSubmitResponseMessage] = useState([]);
  const handleClickOpenSubmitPopup = () => {
    const isLoggedIn = Boolean(sessionStorage.getItem("isLoggedIn"));
    if (isLoggedIn) {
      setOpenSubmitPopup(true);
    }
    else {
      alert("Please loggin to submit")
    }
  }

  const handleCloseSubmitPopup = () => {
    setOpenSubmitPopup(false);
  }

  const handleTextFieldChange = (event) => {
    console.log(subFileName)
    setSubFileName(event.target.value)
  }

  const handlingSubmission = () => {
    if (selectedImages === null || subFileName === '') {
      alert('Please select images or fill out file submission name')
    }
    else {

      const customColumnNames = {
        video: 'Video',
        frameId: 'Frame idx',
      };
      const csvContent = convertArrayToCSV(selectedImages, customColumnNames);

      // Create a Blob containing the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv' });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element for the download
      const link = document.createElement('a');
      link.href = url;

      link.download = subFileName + ".csv";

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
    }
  }

  const convertArrayToCSV = (array, columnNames) => {
    // Extract the desired properties based on custom column names
    const csvData = array.map((row, index) => ({
      [columnNames.video]: row.filename.split("/")[0],
      [columnNames.frameId]: row.filename.split("/")[1].replace(".jpg", "")
    }));

    // Create the CSV header based on custom column names
    // const header = `${columnNames.video},${columnNames.frameId}\n`;

    // Convert the extracted data to CSV format
    const csv = csvData.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === 'string' ? `"${value}"` : value))
        .join(',')
    );

    return csv.join('\n');
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    console.log(result)
    const items = [...selectedImages];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedImages(items);
  };

  const handleDeleteImage = (imageId) => {
    const updatedSelectedImages = selectedImages.filter((image) => image._id !== imageId);
    setSelectedImages(updatedSelectedImages);
  };

  const handlingClearSelectedImages = () => {
    setSelectedImages([]);
  }

  const handlingSubmitToSystem = async () => {
    const messageList = []
    if (sessionStorage.getItem("sessionId") === '') {
      console.log('sessionId is not available');
      return;
    }

    const sessionId = sessionStorage.getItem("sessionId");
    console.log('sessionId', sessionId);
    console.log(selectedImages);

    // Create an array of promises for the Axios requests
    const requests = selectedImages.map((selectedImage) => {
      const video_id = selectedImage['filename'].split('/')[0];
      const frame_id = selectedImage['filename'].split('/')[1].replace(".jpg", "");
      const sessionId = sessionStorage.getItem('sessionId');
      return axios.get(`https://eventretrieval.one/api/v1/submit`, {
        params: {
          item: video_id,
          frame: frame_id,
          session: sessionId,
        }
      });
    });

    try {
      const responses = await Promise.all(requests);
      console.log('resp', responses)
      responses.forEach((response) => {
        const data = {
          submission: response.data.submission,
          description: response.data.description,
          status: response.status,
          variant: response.data.submission === "WRONG" ? "error" : "success"
        }
        messageList.push(data);
      });

      console.log('message-list', messageList)
    } catch (error) {
      const errorData = {
        submission: 'Duplicated',
        description: 'Submission is duplicated',
        status: 412,
        variant: 'error'
      }
      messageList.push(errorData)
      console.log('message-list-error', error)
    }
    setSubmitResponseMessage(messageList)
    setOpenSubmitPopup(false);
    setSelectedImages([]);
  }

  if (selectedImages !== undefined) {
    return (
      <React.Fragment>
        <IntegrationNotistack submitResponseMessage={submitResponseMessage} setSubmitResponseMessage={setSubmitResponseMessage} />
        <h3>Image Submission Sites</h3>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              id="outlined-basic"
              label="Submission File Name"
              variant="outlined"
              fullWidth
              onChange={handleTextFieldChange}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={handlingSubmission}
              fullWidth
            >
              Download CSV
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              onClick={handlingClearSelectedImages}
              fullWidth
            >
              Clear Selected Images
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleClickOpenSubmitPopup}
            >
              Submit to System
            </Button>
          </Grid>
        </Grid>

        <SubmitConfirmationPopup open={openSubmitPopup} handleClose={handleCloseSubmitPopup} handleSubmit={handlingSubmitToSystem} />


        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="selectedImages">
            {(provided) => (
              <ImageList
                sx={{ width: 'auto', height: 'auto' }}
                cols={9}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {selectedImages.map((image, index) => (
                  <Draggable key={image['_id']} draggableId={String(image['_id'])} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ImageListItemWithStyle key={image['_id']}>
                          <ImageListItemBar
                            title={image.filename}
                            position="top"
                            actionIcon={
                              <IconButton
                                aria-label={`Delete ${image.filename}`}
                                onClick={() => handleDeleteImage(image._id)}
                              >
                                <DeleteIcon sx={{ color: 'white' }} />
                              </IconButton>
                            }
                          />
                          <img
                            src={`data:image/jpeg;base64,${image['image_data']}`}
                            alt={image._id}
                            loading="lazy"
                          />
                        </ImageListItemWithStyle>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ImageList>
            )}
          </Droppable>
        </DragDropContext>
      </React.Fragment>
    );
  }
}

export default ImagePicker;