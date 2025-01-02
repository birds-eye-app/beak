import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import OutlinedCard from "../../Card";
import { CurrentYear } from "../../Chirped";
import { UserSelectionsContext } from "../../contexts/UserSelections";
import { TypographyWithFadeIn } from "../Text";

export type QualitativeQuestionData = {
  question: string;
  answer: string;
};
const maxQuestions = 8;

const QualitativeInput = ({ isActive }: { isActive: boolean }) => {
  const { qualitativeQuestions, setQualitativeQuestions } = useContext(
    UserSelectionsContext,
  );

  console.debug("qualitativeQuestions-input", qualitativeQuestions);

  const questionOptions = [
    `what was your favorite bird of ${CurrentYear}?`,
    "What was your nemesis bird this year?",
    "What bird are you most excited to see next year?",
    "Hardest bird you found this year?",
    "Biggest dip of the year?",
    "Biggest surprise bird?",
    "Favorite birding moment?",
    "Favorite mixed flock?",
    "Favorite new hotpot you found this year?",
    "Best birding buddy?",
  ];

  return (
    <OutlinedCard>
      <TypographyWithFadeIn
        in={isActive}
        initialDelay={500}
        variant="h5"
        sx={{ mb: 2 }}
      >
        Numbers can&apos;t tell even close to the whole story.
      </TypographyWithFadeIn>
      <TypographyWithFadeIn
        in={isActive}
        initialDelay={2000}
        variant="body2"
        sx={{ mb: 2 }}
        textAlign={"left"}
      >
        Here you can add some more of the personal touch to your Chirped.
        We&apos;ve added some suggested questions, but feel free to add your
        own!
      </TypographyWithFadeIn>
      <Divider sx={{ mb: 2 }} />
      {qualitativeQuestions.map((data, index) => (
        <Container key={index} disableGutters sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{ textAlign: "left", color: "text.secondary", mb: 1 }}
            key={"t-" + index}
          >
            Question {index + 1}
          </Typography>
          <Autocomplete
            sx={{ width: "100%", mb: 1 }}
            freeSolo
            key={"ac-" + index}
            options={questionOptions}
            value={data.question}
            renderInput={(params) => (
              <TextField
                {...params}
                key={"tf-" + index}
                label="Prompt"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    type: "search",
                  },
                }}
                value={data.question}
                onBlur={(e) => {
                  const newData = [...qualitativeQuestions];
                  newData[index].question = e.target.value;
                  setQualitativeQuestions(newData);
                }}
              />
            )}
          />
          <TextField
            id={`qd-${index}`}
            label="Answer"
            variant="outlined"
            key={"tf2-" + index}
            sx={{ mb: 2, width: "100%" }}
            defaultValue={data.answer}
            onBlur={(e) => {
              const newData = [...qualitativeQuestions];
              newData[index].answer = e.target.value;
              setQualitativeQuestions(newData);
            }}
          />
          <Button
            key={"b-" + index}
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => {
              const newData = [...qualitativeQuestions];
              newData.splice(index, 1);
              setQualitativeQuestions(newData);
            }}
          >
            Delete
          </Button>
        </Container>
      ))}
      <br />
      {qualitativeQuestions.length < maxQuestions && (
        <Button
          component="button"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          color="primary"
          onClick={() =>
            setQualitativeQuestions([
              ...qualitativeQuestions,
              {
                question: "",
                answer: "",
              },
            ])
          }
        >
          {qualitativeQuestions.length > 0
            ? "Add another question"
            : "Add a question"}
        </Button>
      )}
    </OutlinedCard>
  );
};

export default QualitativeInput;
