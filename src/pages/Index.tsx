import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import Paraphraser from "../components/Paraphraser";

export default function Index() {
  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          maxWidth: 1180,
          mx: "auto",
          px: { xs: 1.5, sm: 2.5, md: 3 },
          py: { xs: 1.5, sm: 2 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paraphraser />
      </Box>

      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          textAlign: "center",
          py: 1,
          px: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Powered by Llama 3.3 70B · Free &amp; open source
        </Typography>
      </Box>
    </Box>
  );
}
