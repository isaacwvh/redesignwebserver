import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Drawer, List, ListItem, ListItemText, CssBaseline, Toolbar, Box, Typography, Grid, Card, CardContent, TextField, Container, Button, Alert
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { db } from "./firebase/config";
import { ref, get, set } from "firebase/database";

const drawerWidth = 240;

const Navbar = () => (
  <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
    <Toolbar />
    <List>
      <ListItem button component={RouterLink} to="/">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={RouterLink} to="/camera">
        <ListItemText primary="Camera" />
      </ListItem>
      <ListItem button component={RouterLink} to="/stock">
        <ListItemText primary="Stock" />
      </ListItem>
      <ListItem button component={RouterLink} to="/edit">
        <ListItemText primary="Edit" />
      </ListItem>
    </List>
  </Drawer>
);

const Home = () => (
  <Box sx={{
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    paddingLeft: `${drawerWidth}px`
  }}>
    <Typography variant="h4">Welcome, User</Typography>
  </Box>
);

const Camera = () => (
  <Box sx={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: `${drawerWidth}px`,
    padding: 4
  }}>
    <Typography variant="h4" gutterBottom textAlign="center">Camera Feeds</Typography>
    <Grid container spacing={3} justifyContent="center" maxWidth="1200px">
      {["camera1", "camera2", "camera3"].map((cam, index) => (
        <Grid item xs={12} md={10} lg={8} key={index} sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ width: "100%", mb: 3 }}>
            <CardContent>
              <Typography variant="h6" textAlign="center">{`Camera ${index + 1}`}</Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <img
                  src={`http://localhost:8000/video-feed${index}`}//src={`https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png`} 
                  alt={`Camera ${index + 1}`}
                  style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const Edit = () => {
  const [items, setItems] = React.useState({});

  React.useEffect(() => {
    const fetchItems = async () => {
      const snapshot = await get(ref(db, "items"));
      if (snapshot.exists()) {
        setItems(snapshot.val());
      } else {
        setItems({
          item1: { name: "Item 1", threshold: 0 },
          item2: { name: "Item 2", threshold: 0 },
          item3: { name: "Item 3", threshold: 0 },
          item4: { name: "Item 4", threshold: 0 }
        });
      }
    };
    fetchItems();
  }, []);

  const handleChange = (id, field, value) => {
    setItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: field === "threshold" ? parseFloat(value) : value }
    }));
  };

  const handleSave = async () => {
    await set(ref(db, "items"), items);
    alert("Changes saved!");
  };

  return (
    <Box sx={{ paddingLeft: `${drawerWidth}px`, padding: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Items</Typography>
      <Grid container spacing={2}>
        {Object.entries(items).map(([key, item]) => (
          <Grid item xs={12} md={6} key={key}>
            <Card>
              <CardContent>
                <TextField
                  label="Item Name"
                  fullWidth
                  value={item.name}
                  onChange={(e) => handleChange(key, "name", e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Threshold (kg)"
                  type="number"
                  fullWidth
                  value={item.threshold}
                  onChange={(e) => handleChange(key, "threshold", e.target.value)}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>Save</Button>
    </Box>
  );
};

const Stock = () => {
  const [items, setItems] = React.useState({});
  const [weights, setWeights] = React.useState({});

  React.useEffect(() => {
    const fetchItemsAndWeights = async () => {
      const snapshot = await get(ref(db, "items"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setItems(data);

        const weightData = {};
        for (let key of Object.keys(data)) {
          try {
            const response = await fetch(`http://localhost:8000/weight${key}`);
            const result = await response.json();
            weightData[key] = result.weight;
          } catch (error) {
            console.error("Weight fetch failed", error);
            weightData[key] = null;
          }
        }
        setWeights(weightData);
      }
    };

    fetchItemsAndWeights();
    const interval = setInterval(fetchItemsAndWeights, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingLeft: `${drawerWidth}px`,
      padding: 4
    }}>
      <Typography variant="h4" gutterBottom textAlign="center">Stock Monitoring</Typography>
      <Box sx={{ width: "100%", maxWidth: "600px" }}>
        {Object.entries(items).map(([key, item], index) => {
          const weight = weights[key];
          const isLow = weight !== null && weight < item.threshold;

          return (
            <Card key={index} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography>Threshold: {item.threshold} kg</Typography>
                <Typography>Current Weight: {weight ?? "Loading..."} kg</Typography>
                {isLow && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Alert: Below Threshold!
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

const App = () => (
  <Router>
    <CssBaseline />
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Navbar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </Box>
    </Box>
  </Router>
);

export default App;
