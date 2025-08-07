import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Grid, TextField, Box } from "@mui/material";


const Camera = () => (
    <Container>
      <Typography variant="h4" gutterBottom>Camera Feeds</Typography>
      <Grid container spacing={2}>
        {["camera1", "camera2", "camera3"].map((cam, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{`Camera ${index + 1}`}</Typography>
                <img src={`http://localhost:8000/${cam}`} alt={`Camera ${index + 1}`} width="100%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

export default Camera