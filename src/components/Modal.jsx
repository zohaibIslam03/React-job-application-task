import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Grow,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { firestore } from "../firebase/firebaseConfig.js";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import moment from "moment";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "12px",
    padding: theme.spacing(2),
    width: "650px",
    maxWidth: "90%",
  },
}));

const DragAndDropArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: "8px",
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
  cursor: "pointer",
  backgroundColor: theme.palette.background.default,
}));

const UploadIcon = styled("div")(({ theme }) => ({
  fontSize: "50px",
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const CenteredPopover = styled(Box)(({ theme }) => ({
  position: "fixed",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.success.main, 
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: theme.shadows[5],
  zIndex: 1350,
  pointerEvents: "none",
}));

export default function CustomModal({ open, onClose, cardData }) {
  const [title, setTitle] = useState(cardData?.name || "");
  const [showPopover, setShowPopover] = useState(false);
  const [showSuccessPopover, setShowSuccessPopover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  useEffect(() => {
    if (cardData) {
      setTitle(cardData.name);
    }
  }, [cardData]);

  const handleSubmit = async () => {
    if (!title) {
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000);
    } else {
      setLoading(true);
      const currentDate = moment().format("YYYY-MM-DD");
  
      try {
        if (cardData) {
          const cardRef = doc(firestore, "projects", cardData.id);
          await updateDoc(cardRef, {
            title: title,
            date: cardData.date || currentDate, 
          });
  
          console.log("Document updated with ID: ", cardData.id);
        } else {
          const docRef = await addDoc(collection(firestore, "projects"), {
            title: title,
            date: currentDate,
          });
  
          console.log("Document written with ID: ", docRef.id);
        }
  
        setTitle("");
        setSelectedImageUrl("");
        setLoading(false);
  
        console.log("Updating the project!");
        setShowSuccessPopover(true);
        setTimeout(() => setShowSuccessPopover(false), 3000);
  
        onClose();
      } catch (error) {
        console.error("Error adding or updating document: ", error);
        setLoading(false);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
    }
  };

  return (
    <>
      <StyledDialog open={open} onClose={onClose}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: 600,
            paddingTop: "24px",
          }}
        >
          {cardData ? "Update " : "Add "}
          Check In
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              sx: { borderRadius: "8px" },
            }}
          />

          <DragAndDropArea
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="file"
              style={{ display: "none" }}
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <UploadIcon>📦</UploadIcon>
              <Typography variant="body2">
                Click or drag file to this area to upload
              </Typography>
              <Typography
                variant="caption"
                display="block"
                sx={{ marginTop: "8px", color: "gray" }}
              >
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other banned files.
              </Typography>
            </label>
          </DragAndDropArea>

          {selectedImageUrl && (
            <Typography variant="body2" sx={{ color: "green", marginTop: 2 }}>
              {selectedImageUrl}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: "16px 24px",
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: "20px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: "20px",
              backgroundColor: "#6c63ff",
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : cardData ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </StyledDialog>

      <Grow in={showPopover}>
        <CenteredPopover>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Please fill in all fields before submitting!
          </Typography>
        </CenteredPopover>
      </Grow>

      <Grow in={showSuccessPopover}>
        <CenteredPopover sx={{ backgroundColor: "green" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Project {cardData ? "updated" : "created"} successfully!
          </Typography>
        </CenteredPopover>
      </Grow>
    </>
  );
}
