import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { firestore } from "../firebase/firebaseConfig.js";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";  
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "./Modal.jsx";

const ProjectCard = () => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("grid");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); 

  const fetchData = () => {
    const unsubscribe = onSnapshot(
      collection(firestore, "projects"),
      (querySnapshot) => {
        const projects = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            image:
              "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
            name: data.title,
            date: data.date || "N/A",
            owner: "John Doe",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          };
        });
        setCardData(projects);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => unsubscribe();
  }, []);

  const handleEdit = (card) => {
    setSelectedCard(card);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const projectRef = doc(firestore, "projects", id);
      await deleteDoc(projectRef);
      setCardData((prevData) => prevData.filter((card) => card.id !== id)); 
      console.log("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Box sx={{ mt: 4, px: 3, mb: 6 }}>
      <Typography
        variant="h4"
        fontWeight="25"
        fontSize={45}
        gutterBottom
        sx={{ textAlign: "center", mb: 4, mt: 10 }}
      >
        Added CheckIns
      </Typography>
      <Box sx={{ justifySelf: "flex-end" }}>
        <IconButton
          onClick={() => setViewType(viewType === "grid" ? "list" : "grid")}
          color="primary"
          sx={{ fontSize: 40, padding: 2 }}
        >
          {viewType === "grid" ? (
            <ViewListIcon sx={{ fontSize: "inherit" }} />
          ) : (
            <ViewModuleIcon sx={{ fontSize: "inherit" }} />
          )}
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          cardData.map((card) => (
            <Card
              key={card.id}
              sx={{
                width: viewType === "grid" ? 300 : "90%", 
                borderRadius: "16px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                position: "relative",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "#6c63ff",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: "16px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  zIndex: 1,
                }}
              >
                Checked In
              </Box>

              <CardMedia
                component="img"
                height="140"
                image={card.image}
                alt={card.name}
                sx={{
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />

              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {card.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.date}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Avatar src={card.avatar} alt={card.owner} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    <strong>Owner:</strong> {card.owner}
                  </Typography>
                </Box>
              </CardContent>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                <Tooltip title="Edit Project" arrow>
                  <IconButton
                    onClick={() => handleEdit(card)}
                    color="primary"
                    sx={{ fontSize: 24 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete Project" arrow>
                  <IconButton
                    onClick={() => handleDelete(card.id)}
                    color="error"
                    sx={{ fontSize: 24 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          ))
        )}
      </Box>

      <CustomModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        cardData={selectedCard}
      />
    </Box>
  );
};

export default ProjectCard;
