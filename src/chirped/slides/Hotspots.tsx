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
        You visited <b>{yearStats.numberOfHotspots}</b> hotspots in{" "}
        {CurrentYear}.
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        But only one was your favorite...
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        <b>{yearStats.topHotspots[0].locationName}</b> with{" "}
        <b>{yearStats.topHotspots[0].checklistCount}</b> checklists. You spent a
        total of <b>{yearStats.topHotspots[0].timeSpentMinutes}</b> minutes
        here.
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        The runners up were...
      </Typography>
      <ol style={{ maxHeight: 200, overflowY: "auto" }}>
        {yearStats.topHotspots.slice(1).map((hotspot, index) => (
          <li key={hotspot.locationID} value={index + 2}>
            <Typography>
              {hotspot.locationName} ({hotspot.checklistCount} checklists /{" "}
              {hotspot.timeSpentMinutes} minutes)
            </Typography>
          </li>
        ))}
      </ol>
    </OutlinedCard>
  );
};

export default Slide3;
