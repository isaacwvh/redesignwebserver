import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Grid, TextField, Box } from "@mui/material";

const Home = () => (
    <Container>
      <Typography variant="h4" gutterBottom>Welcome, User</Typography>
      <Typography variant="body1">Select a section from the navigation bar.</Typography>
    </Container>
  );

  export default Home