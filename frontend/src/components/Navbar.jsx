import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Grid, TextField, Box } from "@mui/material";

const Navbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard</Typography>
      <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: 20 }}>Home</Link>
      <Link to="/camera" style={{ color: "white", textDecoration: "none", marginRight: 20 }}>Camera</Link>
      <Link to="/stock" style={{ color: "white", textDecoration: "none" }}>Stock</Link>
    </Toolbar>
  </AppBar>
);

export default Navbar