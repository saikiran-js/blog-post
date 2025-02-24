import React from "react";
import { Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";  
const HomePage = () => {
  const navigate = useNavigate(); 

  const handleReadBlogClick = () => {
    navigate("/posts");
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Blog
      </Typography>
      <Typography variant="h5" paragraph>
        Click the button below to read the latest blog posts
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleReadBlogClick} 
        style={{ marginTop: "20px" }}
      >
        Read Blog Posts
      </Button>
    </Container>
  );
};

export default HomePage;
