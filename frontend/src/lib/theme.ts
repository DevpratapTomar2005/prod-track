import { createTheme } from "@mui/material/styles";

export const timePickerTheme = createTheme({
    palette: {
      primary: {
        main: "#22d3ee", // cyan-400
        contrastText: "#ffffff",
      },
      background: {
        paper: "#ffffff",
        default: "#ffffff",
      },
      text: {
        primary: "#262626", // neutral-800
        secondary: "#737373", // neutral-500
      },
    },
    shape: {
      borderRadius: 6,
    },
    components: {
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e5e5",
            paddingBottom: "12px",
          },
        },
      },
      MuiPickersToolbarText: {
        styleOverrides: {
          root: {
            color: "#a3a3a3", // neutral-400
            "&.Mui-selected": {
              color: "#22d3ee", // cyan-400
            },
          },
        },
      },
      MuiClock: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
          },
          clock: {
            backgroundColor: "#f5f5f5", // neutral-100
          },
          pin: {
            backgroundColor: "#22d3ee",
          },
        },
      },
      MuiClockPointer: {
        styleOverrides: {
          root: {
            backgroundColor: "#22d3ee",
          },
          thumb: {
            backgroundColor: "#22d3ee",
            borderColor: "#22d3ee",
          },
        },
      },
      MuiClockNumber: {
        styleOverrides: {
          root: {
            color: "#525252", // neutral-600
            "&.Mui-selected": {
              backgroundColor: "#22d3ee",
              color: "#ffffff",
            },
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          button: {
            color: "#22d3ee",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#22d3ee",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#ecfeff", // cyan-50
            },
          },
        },
      },
      MuiPickersLayout: {
        styleOverrides: {
          root: {
            backgroundColor: "#ffffff",
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            boxShadow: "none",
          },
          actionBar: {
            borderTop: "1px solid #e5e5e5",
            padding: "8px",
          },
        },
      },
    },
  });