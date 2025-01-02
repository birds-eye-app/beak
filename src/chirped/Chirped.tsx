import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { performChirpedCalculations } from "./calculate";
import { ChirpedContext, ChirpedContextType } from "./Context";
import { makeNewChirpedContext } from "./helpers";
import { parseObservations } from "./parseEbirdExport";
import Upload from "./components/slides/Upload";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Checklists from "./components/slides/Checklists";
import Counts from "./components/slides/Counts";
import Hotspots from "./components/slides/Hotspots";
import Lifers from "./components/slides/Lifers";
import Species from "./components/slides/Species";
import Summary from "./components/slides/Summary";
import Totals from "./components/slides/Totals";
import "./styles.css";
import { Container } from "@mui/material";

export const CurrentYear = 2024;

export function Chirped() {
  const [fileContents, setFileContents] = useState("");
  const [actualProcessingComplete, setActualProcessingComplete] =
    useState(false);
  const [fakeProcessingComplete, setFakeProcessingComplete] = useState(false);
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
      setActualProcessingComplete(true);
    }

    runObs();
  }, [fileContents]);

  if (!fakeProcessingComplete) {
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
        <Upload
          onUploadComplete={onUploadComplete}
          actualProcessingComplete={actualProcessingComplete}
          onFakeProcessingComplete={() => {}}
          onStartChirped={() => setFakeProcessingComplete(true)}
        />
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
        </Swiper>
      </ChirpedContext.Provider>
    </>
  );
}
