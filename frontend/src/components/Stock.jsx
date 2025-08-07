import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Container, Card, CardContent, Grid, TextField, Box } from "@mui/material";

const Stock = () => {
    const [weights, setWeights] = useState([
      { label: "Item 1", value: "0 kg" },
      { label: "Item 2", value: "0 kg" },
      { label: "Item 3", value: "0 kg" }
    ]);
  
    useEffect(() => {
      const fetchWeights = async () => {
        const updatedWeights = await Promise.all(weights.map(async (item, index) => {
          try {
            const response = await fetch(`http://localhost:8000/weight${index + 1}`);
            const data = await response.json();
            return { ...item, value: `${data.weight} kg` };
          } catch (error) {
            console.error("Error fetching weight", error);
            return item;
          }
        }));
        setWeights(updatedWeights);
      };
      fetchWeights();
    }, []);
  
    return (
      <Container>
        <Typography variant="h4" gutterBottom>Stock Monitoring</Typography>
        {weights.map((item, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>
              <TextField
                label="Item Name"
                variant="outlined"
                fullWidth
                value={item.label}
                onChange={(e) => {
                  const updatedWeights = [...weights];
                  updatedWeights[index].label = e.target.value;
                  setWeights(updatedWeights);
                }}
              />
              <Typography variant="h6" sx={{ marginTop: 1 }}>{item.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    );
  };

  export default Stock