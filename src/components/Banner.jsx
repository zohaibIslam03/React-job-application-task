import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import bannerImage from "../images/BannerImage.jpg";
import Modal from "./Modal";

const Banner = () => {
    const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    console.log('Check-in added');
    handleClose();
  };
  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display :'flex'
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90%",
          height: "300px",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "16px",
          overflow: "hidden",
          mt: 14,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "left",
            maxWidth: "600px",
            color: "white",
            padding: "20px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Hi! 👋 James Doe
          </Typography>
          <Typography variant="body1" gutterBottom>
            Lorem ipsum dolor sit amet, something important to say here.
          </Typography>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "30px",
              padding: "10px 20px",
              fontWeight: "bold",
              marginTop :'40px',
              backgroundColor :"#6c63ff",
            }}
            onClick={handleOpen}
          >
            Add Check In
          </Button>
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose} onSubmit={handleSubmit}/>
    </Box>
  );
};

export default Banner;
