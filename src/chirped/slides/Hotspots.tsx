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
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        You visited <b>{yearStats.numberOfHotspots}</b> hotspots in{" "}
        {CurrentYear}.
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        But only one was your favorite...
      </Typography>
      <br />
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 18 }}>
        <b>{chirped.rankings.topHotspots[0].locationName}</b> topped the list
        with <b>{chirped.rankings.topHotspots[0].checklistCount}</b> checklists.
        You spent a total of{" "}
        <b>{chirped.rankings.topHotspots[0].timeSpentMinutes}</b> minutes here.
      </Typography>
      <br />
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        The runners up were...
      </Typography>
      <Container
        disableGutters
        sx={{
          width: "100%",
          maxHeight: 300,
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        <List component="ol">
          {chirped.rankings.topHotspots.map((hotspot, index) => (
            <ListItem key={hotspot.locationID}>
              <Container
                disableGutters
                sx={{ flexDirection: "row", display: "flex" }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 14,
                    marginRight: 1,
                  }}
                >
                  {index + 1}.{" "}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                  {hotspot.locationName}
                </Typography>
                <Container sx={{ flex: 1 }} />
                <Typography sx={{ color: "text.primary", fontSize: 14 }}>
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
