import Typography from "@mui/material/Typography";
import { CurrentYear } from "../Chirped";
import { useContext } from "react";
import { ChirpedContext } from "../Context";
import OutlinedCard from "../Card";

const Slide1 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        This was quite the year for birding!
      </Typography>
      <br />
      <br />
      <Typography sx={{ color: "text.primary", mb: 1.5 }}>
        You submitted <b>{yearStats.checklists.toLocaleString()}</b> checklists
        in {CurrentYear} and spent a total of{" "}
        <b>{yearStats.totalTimeSpentMinutes.toLocaleString()}</b> minutes
        birding!
      </Typography>
      <br />
      <br />
      <Typography variant="body2">
        Let&apos;s see how those checklists broke down...
      </Typography>
    </OutlinedCard>
  );
};

export default Slide1;
