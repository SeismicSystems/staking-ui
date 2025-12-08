import React, { useState } from "react";
import { TextField, IconButton, Box, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

interface TransportURISetterProps {
  publicTransportURI: string;
  setPublicTransportURI: (uri: string) => void;
}

const TransportURISetter = ({
  publicTransportURI,
  setPublicTransportURI,
}: TransportURISetterProps) => {
  const [value, setValue] = useState(publicTransportURI);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setPublicTransportURI(value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        height: "60px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!isOpen ? (
        <Button variant="outlined" onClick={() => setIsOpen(true)}>
          CHANGE RPC URL
        </Button>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Transport URI"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            autoFocus
          />
          <IconButton
            color="primary"
            onClick={handleSave}
            aria-label="save transport URI"
          >
            <SaveIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default TransportURISetter;
