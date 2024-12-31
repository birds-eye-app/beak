import { Container, ListItem } from "@mui/material";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../Card";
import { CurrentYear } from "../Chirped";
import { ChirpedContext } from "../Context";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 18 }}>
        You saw <b>{yearStats.species}</b> species of birds in {CurrentYear}{" "}
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        That&apos;s across <b>{yearStats.genera}</b> genera and{" "}
        <b>{yearStats.families}</b> families!
      </Typography>
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
        {" "}
        You took the safe option and left things as a spuh{" "}
        <b>{yearStats.numberOfSpuhs}</b> times...
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 18 }}>
        Your most observed bird by checklist frequency was{" "}
        <b>{chirped.rankings.mostObservedByChecklistFrequency[0].species}</b>{" "}
        with{" "}
        <b>
          {
            chirped.rankings.mostObservedByChecklistFrequency[0]
              .totalObservations
          }
        </b>{" "}
        sightings.
      </Typography>
      <br />
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        Here&apos;s the full list:
      </Typography>
      <Container
        disableGutters
        sx={{
          width: "100%",
          maxHeight: 200,
          bgcolor: "background.paper",
          overflowY: "auto",
        }}
      >
        <List component="ol">
          {chirped.rankings.mostObservedByChecklistFrequency.map(
            (species, index) => (
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
                  <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                    {species.species}
                  </Typography>
                  <Container sx={{ flex: 1 }} />
                  <Typography sx={{ color: "text.primary", fontSize: 14 }}>
                    {species.totalObservations}
                  </Typography>
                </Container>
              </ListItem>
            ),
          )}
        </List>
      </Container>
    </OutlinedCard>
  );
};

export default Slide3;
