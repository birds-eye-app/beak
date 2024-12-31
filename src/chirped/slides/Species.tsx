import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";
import { CurrentYear } from "../Chirped";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        You saw <b>{yearStats.species}</b> species of birds in {CurrentYear}{" "}
      </Typography>
      {/* <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        That&apos;s across XXX_Genus_Count genera and XXX_Family_Count families!
      </Typography> */}
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        {" "}
        You took the safe option and left things as a spuh{" "}
        <b>{yearStats.numberOfSpuhs}</b> times...
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        Your most observed bird by checklist frequency was{" "}
        <b>{yearStats.mostObservedByChecklistFrequency[0].species}</b> with{" "}
        <b>{yearStats.mostObservedByChecklistFrequency[0].totalObservations}</b>{" "}
        sightings.
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        The runner ups were...
      </Typography>
      <ol style={{ maxHeight: 200, overflowY: "auto" }}>
        {yearStats.mostObservedByChecklistFrequency
          .slice(1)
          .map((species, index) => (
            <li key={species.species} value={index + 2}>
              <Typography
                gutterBottom
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                {species.species} ({species.totalObservations} sightings)
              </Typography>
            </li>
          ))}
      </ol>
    </OutlinedCard>
  );
};

export default Slide3;
