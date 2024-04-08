/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, FormLabel, Grid, Input, Typography, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';

const ImageUpdateForm = (props) => {
  const {onChange} = props;
  const [images, setImages] = useState([]);
  const [onUploadImages, setOnUploadImages] = useState(false);
  const token = localStorage.getItem('token')

  const handleImageChange = async (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
    setOnUploadImages(true)
    try {

        const formData = new FormData();
        formData.append('image', file);
        let response = await axios.post(`${import.meta.env.VITE_URL_BACKEND || 'https://luca-home.vercel.app'}/upload`, formData, {
            headers: {
              'Authorization': token,
              'Content-Type': 'multipart/form-data',
            },
          });
        response = response?.data
        if(response?.code === 1000) {
            updatedImages[index] = response?.data?.url
            setImages(updatedImages);
            
            onChange(updatedImages)
        } else {
          updatedImages.splice(index, 1);
          setImages(updatedImages);
        }
    } catch (error) {
        console.log(`ERROR when call upload images ${error.message} -- ${JSON.stringify(error)}`);
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    }
    setOnUploadImages(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    onChange(updatedImages)
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    handleImageChange(index, file);
  };

  useEffect(() => {
    const {imagesData} = props;
    setImages(imagesData || []);
    
    }, [props])

  return (
    <Grid container spacing={2} mt={3} display="flex" justifyContent="center">
      {images.map((image, index) => (
        <Grid item key={index} xs={2} md={2} sm={2} style={{minWidth: '250px', maxWidth: '250px', margin: '10px'}}>
          <Card>
            <CardContent>
              <Input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                id={`image-input-${index}`}
                onChange={(e) => handleFileChange(index, e)}
              />
              <FormLabel htmlFor={`image-input-${index}`}>
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt={`Image ${index + 1}`}
                  style={{ width: '250px', height: '250px', objectFit: 'cover' }}
                //   style={{minWidth: '250px', maxWidth: '250px'}}
                />
              </FormLabel>
              <Button
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-20px',
                  color: 'red',
                  fontSize: '18px',
                  padding: 0,
                }}
                style={{borderRadius: '50%'}}
              >
                X
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}

        <Grid item xs={2} md={2} sm={2} style={{minWidth: '250px', minHeight: '250px', margin: '10px'}}>
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              height: '100%',
            }}
          >
            <Input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="add-image-input"
              onChange={(e) => handleFileChange(images.length, e)}
            />
            <FormLabel htmlFor="add-image-input">
              <Button variant="outlined" component="span">
                +
              </Button>
            </FormLabel>
          </Card>
        </Grid>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={onUploadImages}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
    </Grid>
  );
};

ImageUpdateForm.propTypes = {
  imagesData: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default ImageUpdateForm;