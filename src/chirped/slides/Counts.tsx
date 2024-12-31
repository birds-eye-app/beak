import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";
import List from "@mui/material/List";
import { Container, ListItem } from "@mui/material";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard justifyContent="flex-start">
      <Typography variant="body1">
        Sometimes it&apos;s not just about adding species to the list...
      </Typography>
      <Typography variant="body1">
        {" "}
        It&apos;s also about counting the birds!
      </Typography>
      <br />
      <Typography variant="h5">
        {" "}
        You counted a total of{" "}
        <b>{yearStats.totalBirdsCounted.toLocaleString()}</b> birds this year
      </Typography>
      <br />
      <Typography variant="body2">
        {" "}
        (If you&apos;re curious, that&apos;s an average of about{" "}
        <b>
          {(
            yearStats.totalBirdsCounted / yearStats.totalTimeSpentMinutes
          ).toFixed(2)}
        </b>{" "}
        birds per minute)
      </Typography>
      <br />
      <Typography variant="body2" sx={{ mb: 2 }}>
        {" "}
        Here are the birds that topped the counts for the year:
      </Typography>
      <Container
        disableGutters
        sx={{
          width: "100%",
          maxHeight: 150,
          overflowY: "auto",
        }}
      >
        <List component="ol">
          {chirped.rankings.mostObservedByTotalCount.map((species, index) => (
            <ListItem disableGutters disablePadding key={species.species}>
              <Container
                disableGutters
                sx={{ flexDirection: "row", display: "flex" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    marginRight: 1,
                  }}
                >
                  {index + 1}.{" "}
                </Typography>
                <Typography variant="body2">{species.species}</Typography>
                <Container sx={{ flex: 1 }} />
                <Typography variant="body2">{species.totalCounts}</Typography>
              </Container>
            </ListItem>
          ))}
        </List>
      </Container>
    </OutlinedCard>
  );
};

export default Slide3;
