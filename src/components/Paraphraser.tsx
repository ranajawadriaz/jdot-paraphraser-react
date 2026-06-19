import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { PARAPHRASE_MODES, paraphraseText } from "../services/paraphraserService";

const Editor = styled("textarea")(({ theme }) => ({
  flex: 1,
  width: "100%",
  minHeight: 0,
  resize: "none",
  border: "none",
  outline: "none",
  background: "transparent",
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: "1rem",
  lineHeight: 1.7,
  padding: theme.spacing(2),
  overflowY: "auto",
  "&::placeholder": { color: theme.palette.text.secondary, opacity: 0.7 },
}));

const countWords = (value: string) => (value.trim() ? value.trim().split(/\s+/).length : 0);

interface PanelHeaderProps {
  title: string;
  text: string;
  action?: React.ReactNode;
}

function PanelHeader({ title, text, action }: PanelHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
        gap: 1,
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {countWords(text)} words · {text.length} chars
        </Typography>
        {action}
      </Box>
    </Box>
  );
}

const panelSx = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  borderRadius: 3,
} as const;

export default function Paraphraser() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  const handleParaphrase = async () => {
    if (!input.trim()) {
      setToast({ message: "Please enter some text to paraphrase.", severity: "error" });
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const result = await paraphraseText(input, mode);
      setOutput(result);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Something went wrong.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setToast({ message: "Copied to clipboard.", severity: "success" });
    } catch {
      setToast({ message: "Could not copy text.", severity: "error" });
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, gap: 2 }}>
      {/* Writing style selector */}
      <Box sx={{ overflowX: "auto", pb: 0.5 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, value) => value && setMode(value)}
          size="small"
          sx={{ flexWrap: "nowrap", "& .MuiToggleButton-root": { px: 2, whiteSpace: "nowrap" } }}
        >
          {PARAPHRASE_MODES.map((m) => (
            <ToggleButton key={m.key} value={m.key}>
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Editor panels */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          flex: 1,
          minHeight: 0,
        }}
      >
        <Paper variant="outlined" sx={panelSx}>
          <PanelHeader
            title="Original"
            text={input}
            action={
              <Tooltip title="Clear">
                <span>
                  <IconButton size="small" onClick={handleClear} disabled={!input && !output}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            }
          />
          <Editor
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste or type the text you want to rewrite…"
            spellCheck
          />
        </Paper>

        <Paper variant="outlined" sx={panelSx}>
          <PanelHeader
            title="Paraphrased"
            text={output}
            action={
              <Tooltip title="Copy">
                <span>
                  <IconButton size="small" onClick={handleCopy} disabled={!output}>
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            }
          />
          <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  zIndex: 1,
                }}
              >
                <CircularProgress size={28} />
              </Box>
            )}
            <Box
              sx={{
                height: "100%",
                overflowY: "auto",
                p: 2,
                whiteSpace: "pre-wrap",
                lineHeight: 1.7,
                color: output ? "text.primary" : "text.secondary",
                fontStyle: output ? "normal" : "italic",
              }}
            >
              {output || "Your rewritten text will appear here."}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Action bar */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleParaphrase}
          disabled={loading || !input.trim()}
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoFixHighRoundedIcon />}
          sx={{ px: 4, minWidth: 200 }}
        >
          {loading ? "Paraphrasing…" : "Paraphrase"}
        </Button>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
