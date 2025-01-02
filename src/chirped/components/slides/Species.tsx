import { Container, ListItem } from "@mui/material";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../../Card";
import { CurrentYear } from "../../Chirped";
import { ChirpedContext } from "../../Context";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
        You saw <b>{yearStats.species}</b> species of birds in {CurrentYear}{" "}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, textAlign: "center" }}>
        That&apos;s across <b>{yearStats.genera}</b> genera and{" "}
        <b>{yearStats.families}</b> families!
      </Typography>
      <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
        {" "}
        You took the safe option and left things as a spuh{" "}
        <b>{yearStats.numberOfSpuhs}</b> times...
      </Typography>
      <Typography variant="body1" sx={{ mb: 1, textAlign: "center" }}>
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
      <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
        Here&apos;s the full list:
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
          {chirped.rankings.mostObservedByChecklistFrequency.map(
            (species, index) => (
              <ListItem disableGutters disablePadding key={species.species}>
                <Container
                  disableGutters
                  sx={{ flexDirection: "row", display: "flex" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mr: 1, textAlign: "center" }}
                  >
                    {index + 1}.{" "}
                  </Typography>
                  <Typography variant="body2">{species.species}</Typography>
                  <Container sx={{ flex: 1 }} />
                  <Typography variant="body2">
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
