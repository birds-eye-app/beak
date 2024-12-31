import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";

const Slide2 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      {yearStats.checklistsByType.stationary > 0 && (
        <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
          Some of the time you stuck it out in one spot... logging{" "}
          <b>{yearStats.checklistsByType.stationary.toLocaleString()}</b>{" "}
          stationary checklists
        </Typography>
      )}
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        Other times you were on the move... logging{" "}
        <b>{yearStats.checklistsByType.traveling.toLocaleString()}</b> traveling
        checklists and covering <b>{yearStats.totalDistanceKm.toFixed()}</b> km
        over the year!
      </Typography>
      {yearStats.checklistsByType.incidental > 0 && (
        <Typography sx={{ color: "text.primary", fontSize: 14 }}>
          And for others... well only you can say how you found the bird.
          Here&apos;s to your{" "}
          <b>{yearStats.checklistsByType.incidental.toLocaleString()}</b>{" "}
          incidental checklists, the birds seen on the way to somewhere else,
          the ones you had to say &quot;excuse me a minute, I just heard
          something&quot;, and the cars pulled over to the side of the road to
          get a better look.
        </Typography>
      )}
    </OutlinedCard>
  );
};

export default Slide2;
