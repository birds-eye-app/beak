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
        You started the year with{" "}
        <b>{chirped.lifeList.length - yearStats.newLifersCount}</b> birds on
        your life list.
      </Typography>
      <br />
      <Typography
        gutterBottom
        sx={{ color: "text.primary", fontSize: 18, textAlign: "left" }}
      >
        You added <b>{yearStats.newLifersCount}</b> new birds to your life list
        in {CurrentYear}...
      </Typography>
      <Typography
        gutterBottom
        sx={{ color: "text.primary", fontSize: 18, textAlign: "right" }}
      >
        ... which means your total life list is now{" "}
        <b>{chirped.lifeList.length}!</b>
      </Typography>
      <br />
      <br />
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
        Let&apos;s take a closer look at those species
      </Typography>
    </OutlinedCard>
  );
};

export default Slide3;
