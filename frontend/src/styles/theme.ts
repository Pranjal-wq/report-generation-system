import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	typography: {
		fontFamily: '"Montserrat", sans-serif',
		button: {
			textTransform: "none",
		},
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: `
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Montserrat'), url('/assets/Fonts/Montserrat-VariableFont_wght.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Montserrat';
          font-style: italic;
          font-display: swap;
          font-weight: 400;
          src: local('Montserrat'), url('/assets/Fonts/Montserrat-Italic-VariableFont_wght.ttf') format('truetype');
        }
      `,
		},
	},
});
