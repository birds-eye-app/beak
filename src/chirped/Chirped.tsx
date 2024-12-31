import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { performChirpedCalculations } from "./calculate";
import { ChirpedContext, ChirpedContextType } from "./Context";
import { makeNewChirpedContext } from "./helpers";
import { parseObservations } from "./parseEbirdExport";
import Upload from "./slides/Upload";

import { Container } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Checklists from "./slides/Checklists";
import Counts from "./slides/Counts";
import Hotspots from "./slides/Hotspots";
import Lifers from "./slides/Lifers";
import Species from "./slides/Species";
import Summary from "./slides/Summary";
import Totals from "./slides/Totals";
import "./styles.css";

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
      const observations = await parseObservations(fileContents);
      console.debug("found observations", observations.length);
      const chirped = await performChirpedCalculations(
        observations,
        CurrentYear,
      );
      setChirpedObservations(chirped);
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
          <SwiperSlide style={{ background: "#555555" }}>
            <Totals />
          </SwiperSlide>
          <SwiperSlide style={{ background: "#555555" }}>
            <Checklists />
          </SwiperSlide>
          <SwiperSlide style={{ background: "#555555" }}>
            <Lifers />
          </SwiperSlide>
          <SwiperSlide style={{ background: "#555555" }}>
            <Species />
          </SwiperSlide>
          <SwiperSlide style={{ background: "#555555" }}>
            <Counts />
          </SwiperSlide>
          <SwiperSlide style={{ background: "#555555" }}>
            <Hotspots />
          </SwiperSlide>
          <SwiperSlide style={{ background: "#555555" }}>
            <Summary />
          </SwiperSlide>
          {/* <SwiperSlide style={{background: '#eee'}}>
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
          <SwiperSlide style={{background: '#eee'}}>
            <DebugSlide />
          </SwiperSlide> */}
        </Swiper>
      </ChirpedContext.Provider>
    </>
  );
}
