import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../../Card";
import { ChirpedContext } from "../../Context";

const Slide2 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      {yearStats.checklistsByType.stationary > 0 && (
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          Some of the time you stuck it out in one spot... logging{" "}
          <b>{yearStats.checklistsByType.stationary.toLocaleString()}</b>{" "}
          stationary checklists.
        </Typography>
      )}
      <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
        Other times you were on the move... logging{" "}
        <b>{yearStats.checklistsByType.traveling.toLocaleString()}</b> traveling
        checklists and covering <b>{yearStats.totalDistanceKm.toFixed()}</b> km
        over the year!
      </Typography>
      {yearStats.checklistsByType.incidental > 0 && (
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          And for the others... well only you can say how you found the birds!
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
