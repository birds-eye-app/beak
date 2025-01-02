import { createContext, useState } from "react";
import { QualitativeQuestionData } from "../components/slides/QualitativeInput";

export type UserSelections = {
  hotspotRanking: "checklists" | "timeSpent";
  qualitativeQuestions: QualitativeQuestionData[];
  setHotspotRanking: (ranking: "checklists" | "timeSpent") => void;
  setQualitativeQuestions: (questions: QualitativeQuestionData[]) => void;
};

export const UserSelectionsContext = createContext<UserSelections>({
  hotspotRanking: "checklists",
  qualitativeQuestions: [],
  setHotspotRanking: () => {},
  setQualitativeQuestions: () => {},
});

import { ReactNode } from "react";

const defaultQuestions = import.meta.env.DEV
  ? [
      { question: "What was your favorite hotspot?", answer: "My backyard" },
      { question: "What was your favorite bird?", answer: "Eastern Phoebe" },
    ]
  : [];

export const UserSelections = ({ children }: { children: ReactNode }) => {
  const [userSelections, setUserSelections] = useState<UserSelections>({
    hotspotRanking: "checklists",
    qualitativeQuestions: defaultQuestions,
    setHotspotRanking: (ranking: "checklists" | "timeSpent") => {
      console.debug("hotspotRanking-set", ranking);
      setUserSelections((prevState) => ({
        ...prevState,
        hotspotRanking: ranking,
      }));
    },
    setQualitativeQuestions: (questions: QualitativeQuestionData[]) => {
      console.debug("qualitativeQuestions-set", questions);
      setUserSelections((prevState) => ({
        ...prevState,
        qualitativeQuestions: questions,
      }));
    },
  });

  return (
    <UserSelectionsContext.Provider value={userSelections}>
      {children}
    </UserSelectionsContext.Provider>
  );
};
