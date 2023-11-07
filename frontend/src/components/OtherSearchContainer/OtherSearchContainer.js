import axios from "axios";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";


function OtherSearchContainer() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImageSearch = async(imageId) => {
    const params = { imgid: imageId }
    navigate({
      pathname: '/home/main',
      search: `?${createSearchParams(params)}`
    })

    try {
      const response = await axios.get(
        `http://localhost:5000/home/main/imgsearch?imgid=${imageId}`
      );
      setImagesList(response.data['result']);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  }

  return (
    <div></div>
  );
}

export default OtherSearchContainer;
