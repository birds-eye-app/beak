import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";
import { CurrentYear } from "../Chirped";
import List from "@mui/material/List";
import { Container, ListItem } from "@mui/material";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
        You visited <b>{yearStats.numberOfHotspots}</b> hotspots in{" "}
        {CurrentYear}.
      </Typography>
      <Typography variant="body2">But only one was your favorite...</Typography>
      <br />
      <Typography variant="body1">
        <b>{chirped.rankings.topHotspots[0].locationName}</b> was your most
        frequently visited hotspot with{" "}
        <b>{chirped.rankings.topHotspots[0].checklistCount}</b> checklists. You
        spent a total of{" "}
        <b>{chirped.rankings.topHotspots[0].timeSpentMinutes}</b> minutes here.
      </Typography>
      <br />
      <Typography variant="body2" sx={{ mb: 2 }}>
        The runners up were...
      </Typography>
      <Container
        disableGutters
        sx={{
          width: "100%",
          maxHeight: 200,
          overflowY: "auto",
        }}
      >
        <List component="ol">
          {chirped.rankings.topHotspots.map((hotspot, index) => (
            <ListItem disableGutters disablePadding key={hotspot.locationID}>
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
                <Typography variant="body2">{hotspot.locationName}</Typography>
                <Container sx={{ flex: 1 }} />
                <Typography variant="body2">
                  {hotspot.checklistCount}
                </Typography>
              </Container>
            </ListItem>
          ))}
        </List>
      </Container>
    </OutlinedCard>
  );
};

export default Slide3;
