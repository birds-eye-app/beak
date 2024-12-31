import Typography from "@mui/material/Typography";
import { useContext } from "react";
import OutlinedCard from "../Card";
import { ChirpedContext } from "../Context";

const Slide3 = () => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  return (
    <OutlinedCard>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        Sometimes it&apos;s not just about adding species to the list...
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        {" "}
        It&apos;s also about counting the birds!
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        {" "}
        You counted a total of{" "}
        <b>{yearStats.totalBirdsCounted.toLocaleString()}</b> birds
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        {" "}
        If you&apos;re curious, that&apos;s an average of about{" "}
        <b>
          {(
            yearStats.totalBirdsCounted / yearStats.totalTimeSpentMinutes
          ).toFixed(2)}
        </b>{" "}
        birds per minute
      </Typography>
      <Typography gutterBottom sx={{ color: "text.primary", fontSize: 14 }}>
        {" "}
        Here are the birds that topped the counts for the year
      </Typography>
      <ol>
        {yearStats.mostObservedByTotalCount.map((species) => (
          <li key={species.species}>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              {species.species} ({species.totalCounts} sightings)
            </Typography>
          </li>
        ))}
      </ol>
    </OutlinedCard>
  );
};

export default Slide3;
