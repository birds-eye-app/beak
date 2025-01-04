import { Share } from "@mui/icons-material";
import { Alert, Button, Container, ListItem, Typography } from "@mui/material";
import List from "@mui/material/List";
import { useContext, useRef, useState } from "react";
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

export const ShareButton = ({
  shareRef,
  fileName,
}: {
  shareRef: React.RefObject<HTMLDivElement>;
  fileName: string;
}) => {
  const [shareSuccessful, setShareSuccessful] = useState<boolean | null>(null);

  return (
    <Container
      disableGutters
      // floating footer button
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "fixed",
        bottom: 20,
        zIndex: 3,
      }}
    >
      {shareSuccessful !== null && (
        <Alert severity={shareSuccessful ? "success" : "error"} sx={{ mb: 2 }}>
          {shareSuccessful
            ? "Successfully shared!"
            : "Failed to share. Maybe try taking a screenshot of this page instead."}
        </Alert>
      )}
      <Button
        variant="contained"
        startIcon={<Share />}
        onClick={async () => {
          setShareSuccessful(await shareComponent(shareRef.current!, fileName));
          // reset the success message after a few seconds
          setTimeout(() => setShareSuccessful(null), 5000);
        }}
      >
        Share
      </Button>
    </Container>
  );
};

const Summary = ({ isActive }: { isActive: boolean }) => {
  const chirped = useContext(ChirpedContext);
  const yearStats = chirped.yearStats;
  const { hotspotRanking } = useContext(UserSelectionsContext);
  const shareRef = useRef<HTMLDivElement>(null);

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
                maxHeight: 400,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
              }}
            >
              <Container disableGutters sx={{ flex: 1, padding: 0 }}>
                <Typography gutterBottom>Top birds</Typography>
                <Container
                  disableGutters
                  sx={{
                    width: "100%",
                    maxHeight: 300,
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
                          <Typography
                            variant="body2"
                            sx={{
                              maxHeight: 100,
                              overflow: "hidden",
                            }}
                          >
                            {hotspot.locationName}
                          </Typography>
                        </Container>
                      </ListItem>
                    ))}
                  </List>
                </Container>
              </Container>
            </Container>
            <Typography color="success" sx={{ color: "warning" }}>
              {"dtmeadows.me/chirped"}
            </Typography>
          </Container>
        </FadeInWithInitialDelay>
      </OutlinedCard>
      <ShareButton shareRef={shareRef} fileName="chirped-summary.png" />
    </Container>
  );
};

export default Summary;
