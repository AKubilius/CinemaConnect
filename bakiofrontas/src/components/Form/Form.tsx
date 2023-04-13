import {
    Box,
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
  } from "@mui/material";
  
  interface FormContainerProps {
    children: React.ReactNode;
  }
  
  const Form: React.FC<FormContainerProps> = ({ children }) => {
    const theme = createTheme();
  
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {children}
          </Box>
        </Container>
      </ThemeProvider>
    );
  };
  
  export default Form;