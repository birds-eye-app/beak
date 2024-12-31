import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";
import { Typography, Container, ListItem } from "@mui/material";
import List from "@mui/material/List";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography gutterBottom>Thanks and good luck in 2025!</Typography>
      <Typography>
        New lifers: <b>{yearStats.newLifersCount}</b>
      </Typography>
      <Typography>
        Total lifers now: <b>{chirped.lifeList.length}</b>
      </Typography>
      <Typography>
        Checklists submitted: <b>{chirped.yearStats.checklists}</b>
      </Typography>
      <Typography>
        Hotspots visited: <b>{chirped.yearStats.numberOfHotspots}</b>
      </Typography>
      <br />
      <Container
        disableGutters
        sx={{
          width: "100%",
          maxHeight: 300,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Container disableGutters sx={{ flex: 1, padding: 0 }}>
          <Typography gutterBottom>Top birds</Typography>
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
              {chirped.rankings.mostObservedByTotalCount
                .slice(0, 5)
                .map((species, index) => (
                  <ListItem key={species.species}>
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
                      <Typography
                        sx={{ color: "text.secondary", fontSize: 14 }}
                      >
                        {species.species}
                      </Typography>
                    </Container>
                  </ListItem>
                ))}
            </List>
          </Container>
        </Container>
        <Container disableGutters sx={{ flex: 1 }}>
          <Typography gutterBottom>Top Hotspots</Typography>
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
              {chirped.rankings.topHotspots
                .slice(0, 5)
                .map((hotspot, index) => (
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
                      <Typography
                        sx={{ color: "text.secondary", fontSize: 14 }}
                      >
                        {hotspot.locationName}
                      </Typography>
                    </Container>
                  </ListItem>
                ))}
            </List>
          </Container>
        </Container>
      </Container>
    </OutlinedCard>
  );
};

export default Slide3;
