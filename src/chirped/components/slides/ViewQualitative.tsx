import { useContext } from "react";
import OutlinedCard from "../../Card";
import { TypographyWithFadeIn } from "../Text";
import { UserSelectionsContext } from "../../Context";

export type QualitativeQuestionData = {
  question: string;
  answer: string;
};

const ViewQualitative = ({ isActive }: { isActive: boolean }) => {
  const { qualitativeQuestions } = useContext(UserSelectionsContext);
  console.debug("qualitativeQuestions-View", qualitativeQuestions);
  return (
    <OutlinedCard>
      <br />
      <br />
      <TypographyWithFadeIn
        in={isActive}
        initialDelay={500}
        variant="body1"
        sx={{ mb: 2 }}
      >
        Here are the results of your qualitative questions:
      </TypographyWithFadeIn>
      {qualitativeQuestions.map((question, index) => (
        <TypographyWithFadeIn
          in={isActive}
          initialDelay={500}
          variant="body1"
          key={"q" + index}
        >
          {question.question} - {question.answer}
        </TypographyWithFadeIn>
      ))}
    </OutlinedCard>
  );
};

export default ViewQualitative;
