import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";
import { Typography } from "@mui/material";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography gutterBottom>Thanks for all the birds!</Typography>
      <b>Top Birds</b>
      <ol>
        {yearStats.mostObservedByTotalCount.map((species) => (
          <li key={species.species}>
            {species.species} ({species.totalObservations} sightings)
          </li>
        ))}
      </ol>
      <b>Top Hotspots</b>
      <ol>
        {yearStats.topHotspots.map((hotspot) => (
          <li key={hotspot.locationID}>
            {hotspot.locationName} ({hotspot.checklistCount} checklists)
          </li>
        ))}
      </ol>
      <Typography gutterBottom>
        New lifers: <b>{yearStats.newLifersCount}</b>
      </Typography>
      <Typography gutterBottom>
        Total lifers now: <b>{chirped.lifeList.length}</b>
      </Typography>
      <button>
        <b>Share!</b>
      </button>
    </OutlinedCard>
  );
};

export default Slide3;
