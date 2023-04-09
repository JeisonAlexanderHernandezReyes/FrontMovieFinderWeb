import BarSelect from "../bar/BarSelect";
import InputSearch from "../input/InputSearch";
import { Card, CardContent, Box } from "@mui/material";

const FormSearch = () => {
  return (
    <Box>
      <Box mb={4}>
        <BarSelect />
      </Box>
      <Box mx={2}>
        <Card>
          <CardContent>
            <InputSearch />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default FormSearch;