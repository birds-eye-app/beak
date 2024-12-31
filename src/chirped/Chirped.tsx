import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { performChirpedCalculations } from "./calculate";
import { ChirpedContext, ChirpedContextType } from "./Context";
import { makeNewChirpedContext } from "./helpers";
import { parseObservations } from "./parse";
import Upload from "./slides/Upload";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import DebugSlide from "./slides/DebugSlide";
import Totals from "./slides/Totals";
import Checklists from "./slides/Checklists";
import "./styles.css";
import Lifers from "./slides/Lifers";
import Species from "./slides/Species";
import Counts from "./slides/Counts";
import Hotspots from "./slides/Hotspots";
import Summary from "./slides/Summary";
import { Container } from "@mui/material";

export const CurrentYear = 2024;

export function Chirped() {
  const [fileContents, setFileContents] = useState("");
  const [chirpedObservations, setChirpedObservations] =
    useState<ChirpedContextType>(makeNewChirpedContext());

  const onUploadComplete = async (contents: string) => {
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

  if (chirpedObservations.allObservations.length === 0) {
    return (
      <Container
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Upload onUploadComplete={onUploadComplete} />
      </Container>
    );
  }

  return (
    <>
      <ChirpedContext.Provider value={chirpedObservations}>
        <Swiper
          navigation={chirpedObservations.allObservations.length !== 0}
          modules={[Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <Totals />
          </SwiperSlide>
          <SwiperSlide>
            <Checklists />
          </SwiperSlide>
          <SwiperSlide>
            <Lifers />
          </SwiperSlide>
          <SwiperSlide>
            <Species />
          </SwiperSlide>
          <SwiperSlide>
            <Counts />
          </SwiperSlide>
          <SwiperSlide>
            <Hotspots />
          </SwiperSlide>
          <SwiperSlide>
            <Summary />
          </SwiperSlide>
          <SwiperSlide>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Species</th>
                    <th>Observation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {chirpedObservations.lifeList
                    .sort(
                      (a, b) =>
                        new Date(b.dateTime).getTime() -
                        new Date(a.dateTime).getTime(),
                    )
                    .map((bird) => (
                      <tr key={bird.scientificName}>
                        <td>{bird.commonName}</td>
                        <td>{new Date(bird.dateTime).toLocaleDateString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <DebugSlide />
          </SwiperSlide>
        </Swiper>
      </ChirpedContext.Provider>
    </>
  );
}
