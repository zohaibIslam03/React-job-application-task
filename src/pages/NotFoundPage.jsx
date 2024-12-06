
import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" color="primary" sx={{ fontSize: '6rem' }}>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" sx={{ marginBottom: 3 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        sx={{
          padding: '10px 20px',
          fontSize: '1rem',
        }}
      >
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
