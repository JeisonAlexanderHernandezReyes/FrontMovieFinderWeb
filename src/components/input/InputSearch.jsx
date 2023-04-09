  import { useState } from "react";
  import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import SearchIcon from "@mui/icons-material/Search";
  import ClearIcon from "@mui/icons-material/Clear";
  import MovieIcon from "@mui/icons-material/Movie";
  import { styled } from "@mui/material/styles";
  import axios from "axios";

  const InputSearch = () => {

    // #region Hooks
    const [searchTerm, setSearchTerm] = useState("");
    const [movieData, setMovieData] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // #endregion

    /**
     * Esta función realiza una solicitud de búsqueda utilizando la API y actualiza el estado de la aplicación
     * con los datos de la película correspondientes o un mensaje de error si la búsqueda falla.
     *
     * @param {Object} e - El objeto del evento de formulario.
     * @returns {void} Esta función no devuelve nada explícitamente, pero actualiza el estado de la aplicación.
     * Si se producen errores, como la falta de un término de búsqueda o un error de respuesta de la API,
     * la función puede devolver temprano.
     */
    const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchTerm) {
        setError("Ingrese un término de búsqueda");
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://localhost:7295/movie/getMovie",
          {
            headers: {
              nameMovie: searchTerm,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept",
            },
          }
        );
        setIsLoading(false);
        setMovieData(response.data);
        setError(null);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleError = (error) => {
      setError(`Error en la solicitud: ${error.message}`);
    };
    /**
     *
     * Esta función hace una solicitud a la API para obtener una lista de películas similares basadas en el título de
     * una película determinada (movieData). Si movieData es falsa, la función no hará nada. Si la respuesta de la API tiene
     * una propiedad Response con el valor "False", la función tampoco hará nada. En caso contrario, la función establecerá el estado de
     * similarMovies en una matriz de películas que tengan el mismo título que movieData pero con un imdbID diferente.
     * @returns La función no devuelve nada si movieData es falsa o si la respuesta de la API tiene una propiedad Response
     * con el valor "False". Si se encuentran películas similares, la función establecerá el estado de similarMovies
     */
    const handleShowSimilarMovies = async () => {
      if (!movieData) return;
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://localhost:7295/movie/getSimilarMovies",
          {
            headers: {
              nameMovie: searchTerm,
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers":
                "Origin, X-Requested-With, Content-Type, Accept",
            },
          }
        );
        console.log(response);
        setIsLoading(false);
        if (response.data.Response === "False") return;
        const movies = response.data.search.filter(
          (movie) => movie.imdbID !== movieData.imdbID
        );
        setSimilarMovies(movies);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * Esta función se encarga de borrar los datos relacionados con la búsqueda de películas.
     * Al llamarla, se reinicia el término de búsqueda, se borran los datos de la película,
     * se eliminan las películas similares y se restablece el valor del error a "null".
     */
    const handleClear = () => {
      setSearchTerm("");
      setMovieData(null);
      setSimilarMovies([]);
      setError(null);
    };

    /**
     * Crea un nuevo componente estilizado llamado StyledCard utilizando la función
     * styled de MUI. Se aplican algunos estilos CSS al componente Card,
     * estableciendo su ancho máximo en 345 píxeles y su dirección de visualización en
     * columna (display: flex; flex-direction: column;).
     * @returns {JSX.Element} Un nuevo componente Card con los estilos especificados.
     */
    const StyledCard = styled(Card)({
      maxWidth: 345,
      display: "flex",
      flexDirection: "column",
    });

    // Render
    const renderMovieData = () => {
      if (movieData) {
        const { title, year, genre, poster, type } = movieData;
        return (
          <Stack direction="row" spacing={2} justifyContent="center">
            <StyledCard>
              <CardMedia
                component="img"
                height="440"
                image={poster}
                alt={title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title} ({year}) ({type})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {genre}
                </Typography>
                <Button
                  onClick={handleShowSimilarMovies}
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#b5121b",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "#ff364a",
                    },
                  }}
                  startIcon={<MovieIcon />}
                >
                  Películas similares
                </Button>
              </CardContent>
            </StyledCard>
            {isLoading && <CircularProgress />}
            {similarMovies.length > 0 && (
              <Box>
                <Typography variant="h6">Películas similares:</Typography>
                <Grid container spacing={2}>
                  {similarMovies.map((movie) => (
                    <Grid key={movie.imdbID} item xs={12} md={4}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="300"
                          image={movie.poster}
                          alt={movie.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {movie.title} ({movie.year}) ({movie.type})
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Stack>
        );
      }
      return null;
    };
    return (
      <Box sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSearch}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            alignItems={{ xs: "stretch", md: "flex-end" }}
            justifyContent="center"
          >
            <TextField
              label="Buscar película"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              error={error !== null}
              helperText={error}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<SearchIcon />}
              sx={{ backgroundColor: "#b5121b", color: "#fff" }}
            >
              Buscar
            </Button>
            <Button
              onClick={handleClear}
              variant="contained"
              endIcon={<ClearIcon />}
              sx={{ backgroundColor: "#3d3d3d", color: "#fff" }}
            >
              Limpiar
            </Button>
          </Stack>
        </form>

        {renderMovieData()}
      </Box>
    );
  };

  export default InputSearch;