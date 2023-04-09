import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";

function BarSelect() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#a73439" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MovieFilterIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MOVIE FINDER WEB
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default BarSelect;