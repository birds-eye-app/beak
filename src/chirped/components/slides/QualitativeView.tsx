import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import { useContext, useRef } from "react";
import OutlinedCard from "../../Card";
import { UserSelectionsContext } from "../../contexts/UserSelections";
import { FadeInWithInitialDelay } from "../FadeWithInitialDelay";
import { TypographyWithFadeIn } from "../Text";
import { Share } from "@mui/icons-material";
import { shareComponent } from "../../sharing";

export type QualitativeQuestionData = {
  question: string;
  answer: string;
};

const GutterLessContainer = ({ children }: { children: React.ReactNode }) => (
  <Container disableGutters>{children}</Container>
);

const QualitativeView = ({ isActive }: { isActive: boolean }) => {
  const { qualitativeQuestions } = useContext(UserSelectionsContext);
  const shareRef = useRef<HTMLDivElement>(null);

  // ignore any with blank questions or answers
  const questionsToShow = qualitativeQuestions
    .filter((question) => question.question.trim() && question.answer.trim())
    .slice(0, 8);
  return (
    <Container
      disableGutters
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <OutlinedCard ref={shareRef} minHeight={10} justifyContent="flex-start">
        <br />
        <br />
        <TypographyWithFadeIn
          in={isActive}
          initialDelay={500}
          variant="h5"
          sx={{ mb: 2 }}
        >
          Chirped 2024
        </TypographyWithFadeIn>
        <FadeInWithInitialDelay in={isActive} initialDelay={2000}>
          <Container>
            <TableContainer component={GutterLessContainer}>
              <Table aria-label="simple table">
                <TableBody>
                  {questionsToShow.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell width={"50%"} component="th" scope="row">
                        {row.question}
                      </TableCell>
                      <TableCell width={"50%"} align="right">
                        {row.answer}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {"dtmeadows.me/chirped"}
            </Typography>
          </Container>
        </FadeInWithInitialDelay>
      </OutlinedCard>
      <Button
        variant="contained"
        startIcon={<Share />}
        onClick={() => {
          shareComponent(shareRef.current!, "chirped-summary.png");
        }}
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

export default QualitativeView;
