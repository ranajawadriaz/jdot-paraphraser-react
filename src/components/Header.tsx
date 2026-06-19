import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useColorMode } from "../ColorModeProvider";
import { SITE, whatsappUrl } from "../config";

export default function Header() {
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 2,
            mr: 1.5,
            color: "common.white",
            background: (t) =>
              `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
          }}
        >
          <AutoFixHighRoundedIcon fontSize="small" />
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap sx={{ lineHeight: 1.1 }}>
            {SITE.name}
          </Typography>
          {!isMobile && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {SITE.tagline}
            </Typography>
          )}
        </Box>

        <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
          <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle color mode">
            {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        {isMobile ? (
          <Tooltip title="Contact on WhatsApp">
            <IconButton
              component="a"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#25D366" }}
              aria-label="Contact on WhatsApp"
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            component="a"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<WhatsAppIcon />}
            sx={{
              bgcolor: "#25D366",
              "&:hover": { bgcolor: "#1da851" },
            }}
          >
            Contact
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
