import { Share } from "@mui/icons-material";
import { Button, Container, ListItem, Typography } from "@mui/material";
import List from "@mui/material/List";
import { useCallback, useContext, useRef } from "react";
import OutlinedCard from "../../Card";
import { CurrentYear } from "../../Chirped";
import { ChirpedContext } from "../../contexts/Chirped";
import { UserSelectionsContext } from "../../contexts/UserSelections";
import { shareComponent } from "../../sharing";
import { FadeInWithInitialDelay } from "../FadeWithInitialDelay";

const BigNumberWithLabelBelow = ({
  number,
  label,
}: {
  number: number;
  label: string;
}) => (
  <Container disableGutters sx={{ textAlign: "center" }}>
    <Typography variant="h4">{number.toLocaleString()}</Typography>
    <Typography variant="body1" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>
  </Container>
);

const Summary = ({ isActive }: { isActive: boolean }) => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  const { hotspotRanking } = useContext(UserSelectionsContext);
  const shareRef = useRef<HTMLDivElement>(null);

  const onShare = useCallback(() => {
    shareComponent(shareRef.current!, "chirped-summary.png");
  }, []);

  const topHotspots =
    hotspotRanking === "checklists"
      ? chirped.rankings.topHotspotsByChecklists
      : chirped.rankings.topHotspotsByTimeSpent;
  return (
    <Container
      disableGutters
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <OutlinedCard
        justifyContent="flex-start"
        ref={shareRef}
        disableScroll
        maxHeight={800}
      >
        <FadeInWithInitialDelay in={isActive} initialDelay={500}>
          <Container>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Chirped {CurrentYear}
            </Typography>
            <Container
              disableGutters
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <BigNumberWithLabelBelow
                number={yearStats.species}
                label="Species"
              />
              <BigNumberWithLabelBelow
                number={chirped.lifeList.length}
                label="Lifers now"
              />
            </Container>
            <Container
              disableGutters
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <BigNumberWithLabelBelow
                number={yearStats.checklists}
                label="Checklists"
              />
              <BigNumberWithLabelBelow
                number={yearStats.numberOfHotspots}
                label="Hotspots"
              />
            </Container>
            <br />
            <Container
              disableGutters
              sx={{
                width: "100%",
                maxHeight: 300,

                display: "flex",
                flexDirection: "row",
              }}
            >
              <Container disableGutters sx={{ flex: 1, padding: 0 }}>
                <Typography gutterBottom>Top birds</Typography>
                <Container
                  disableGutters
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  <List component="ol">
                    {chirped.rankings.mostObservedByTotalCount
                      .slice(0, 5)
                      .map((species, index) => (
                        <ListItem
                          disableGutters
                          disablePadding
                          key={species.species}
                        >
                          <Container
                            disableGutters
                            sx={{ flexDirection: "row", display: "flex" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                marginRight: 1,
                              }}
                            >
                              {index + 1}.{" "}
                            </Typography>
                            <Typography variant="body2">
                              {species.species}
                            </Typography>
                          </Container>
                        </ListItem>
                      ))}
                  </List>
                </Container>
              </Container>
              <Container disableGutters sx={{ flex: 1 }}>
                <Typography gutterBottom>Top Hotspots</Typography>
                <Container
                  disableGutters
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    overflowY: "auto",
                  }}
                >
                  <List component="ol">
                    {topHotspots.slice(0, 5).map((hotspot, index) => (
                      <ListItem
                        disableGutters
                        disablePadding
                        key={hotspot.locationID}
                      >
                        <Container
                          disableGutters
                          sx={{ flexDirection: "row", display: "flex" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              marginRight: 1,
                            }}
                          >
                            {index + 1}.{" "}
                          </Typography>
                          <Typography variant="body2">
                            {hotspot.locationName}
                          </Typography>
                        </Container>
                      </ListItem>
                    ))}
                  </List>
                </Container>
              </Container>
            </Container>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {"dtmeadows.me/chirped"}
            </Typography>
          </Container>
        </FadeInWithInitialDelay>
      </OutlinedCard>
      <Button
        variant="contained"
        startIcon={<Share />}
        onClick={onShare}
        // floating footer button
        sx={{
          position: "fixed",
          bottom: 20,
          zIndex: 3,
        }}
      >
        Share
      </Button>
    </Container>
  );
};

export default Summary;
