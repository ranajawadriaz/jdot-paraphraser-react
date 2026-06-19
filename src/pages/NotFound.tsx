import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        px: 3,
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: { xs: "4rem", sm: "6rem" } }}>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary">
        This page could not be found.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" size="large">
        Back to Paraphraser
      </Button>
    </Box>
  );
}
