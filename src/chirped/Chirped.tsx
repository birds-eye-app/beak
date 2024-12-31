import { useContext, useEffect, useState } from "react";
import { ChirpedContext, ChirpedContextType } from "./Context";
import { UploadCSV } from "./Upload";
import { parseObservations } from "./parse";
import { performChirpedCalculations } from "./calculate";
import { makeNewChirpedContext } from "./helpers";

const TestComponent = () => {
  const chirped = useContext(ChirpedContext);
  // make a simple html debug table of things like:
  // allObservations.length, yearObservations.length, lifers.length
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>All Observations</td>
            <td>{chirped.allObservations.length}</td>
            <td>{chirped.allObservations[0]?.scientificName}</td>
          </tr>
          <tr>
            <td>Year Observations</td>
            <td>{chirped.yearObservations.length}</td>
            <td>{chirped.yearObservations[0]?.scientificName}</td>
          </tr>
          <tr>
            <td>Lifers</td>
            <td>{chirped.lifeList.length}</td>
            <td>{chirped.lifeList[0]?.scientificName}</td>
          </tr>
          <pre>{JSON.stringify(chirped.yearStats, null, 2)}</pre>
        </tbody>
      </table>
    </>
  );
};

const CurrentYear = 2024;

export function Chirped() {
  const [fileContents, setFileContents] = useState("");
  const [chirpedObservations, setChirpedObservations] =
    useState<ChirpedContextType>(makeNewChirpedContext());
  const [showUploadModal, setShowUploadModal] = useState(true);

  const onUploadComplete = async (contents: string) => {
    setShowUploadModal(false);
    setFileContents(contents);
  };

  useEffect(() => {
    async function runObs() {
      try {
        const observations = await parseObservations(fileContents);
        console.debug("found observations", observations.length);
        const chirped = await performChirpedCalculations(
          observations,
          CurrentYear,
        );
        setChirpedObservations(chirped);
      } catch (e) {
        alert(`Error parsing observations: ${JSON.stringify(e)}`);
      }
    }

    runObs();
  }, [fileContents]);

  console.debug(chirpedObservations.allObservations.length);

  if (chirpedObservations.allObservations.length === 0) {
    return (
      <div>
        <h1>Chirped</h1>
        <p>Welcome!</p>
        <UploadCSV
          showModal={showUploadModal}
          onUploadComplete={onUploadComplete}
        />
      </div>
    );
  }

  return (
    <div>
      <ChirpedContext.Provider value={chirpedObservations}>
        <TestComponent />
      </ChirpedContext.Provider>
    </div>
  );
}
