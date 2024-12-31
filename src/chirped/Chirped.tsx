import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { performChirpedCalculations } from "./calculate";
import { ChirpedContext, ChirpedContextType } from "./Context";
import { makeNewChirpedContext } from "./helpers";
import { parseObservations } from "./parse";
import Slide1_UploadCSV from "./slides/Upload";

import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import DebugSlide from "./slides/DebugSlide";
import "./styles.css";

const CurrentYear = 2024;

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

  const yearStats = chirpedObservations.yearStats;

  if (chirpedObservations.allObservations.length === 0) {
    return <Slide1_UploadCSV onUploadComplete={onUploadComplete} />;
  }

  return (
    <>
      <ChirpedContext.Provider value={chirpedObservations}>
        <Swiper
          navigation={chirpedObservations.allObservations.length !== 0}
          modules={[Navigation]}
          className="mySwiper"
        >
          <>
            <SwiperSlide>
              <div>
                <p>This was quite the year for birding!</p>
                <p>
                  You submitted {yearStats.checklists} checklists in{" "}
                  {CurrentYear} and spent a total of{" "}
                  {yearStats.totalTimeSpentMinutes} minutes birding!
                </p>
                <p> Let&apos;s see how those checklists broke down...</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                {yearStats.checlistsByType.stationary > 0 && (
                  <p>
                    Some of the time you stuck it out in one spot... logging{" "}
                    {yearStats.checlistsByType.stationary} stationary checklists
                  </p>
                )}
                <p>
                  Other times you were on the move... logging{" "}
                  {yearStats.checlistsByType.traveling} traveling checklists and
                  covering {yearStats.totalDistanceKm.toFixed()} km over the
                  year!
                </p>
                {yearStats.checlistsByType.incidental > 0 && (
                  <p>
                    And for others... well only you can say how you found the
                    bird. Here&apos;s to your{" "}
                    <b>{yearStats.checlistsByType.incidental} </b> incidental
                    checklists, the birds seen on the way to somewhere else, the
                    ones you had to say &quot;excuse me a minute, I just heard
                    something&quot;, and the cars pulled over to the side of the
                    road to get a better look.
                  </p>
                )}
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <p>
                  You started the year with{" "}
                  <b>
                    {chirpedObservations.lifeList.length -
                      yearStats.newLifersCount}
                  </b>{" "}
                  birds on your life list
                </p>
                <p>
                  You added <b>{yearStats.newLifersCount}</b> new birds to your
                  life list in {CurrentYear}...
                </p>
                <p>
                  ... which means your total life list is now{" "}
                  <b>{chirpedObservations.lifeList.length}!</b>
                </p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <p>
                  You saw {yearStats.species} species of birds in {CurrentYear}{" "}
                </p>
                <p>
                  That&apos;s across XXX_Genus_Count genera and XXX_Family_Count
                  families!
                </p>
                <p>
                  {" "}
                  You took the safe option and left things as a spuh{" "}
                  {yearStats.numberOfSpuhs} times...
                </p>
                <p>
                  Your most observed bird by checklist frequency was{" "}
                  <b>{yearStats.mostObservedByChecklistFrequency[0].species}</b>{" "}
                  with{" "}
                  {
                    yearStats.mostObservedByChecklistFrequency[0]
                      .totalObservations
                  }{" "}
                  sightings.
                </p>
                <p>The runner ups were...</p>
                <ol>
                  {yearStats.mostObservedByChecklistFrequency
                    .slice(1)
                    .map((species, index) => (
                      <li key={species.species} value={index + 2}>
                        {species.species} ({species.totalObservations}{" "}
                        sightings)
                      </li>
                    ))}
                </ol>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <p>
                  Sometimes it&apos;s not just about adding species to the
                  list...
                </p>
                <p> It&apos;s also about counting the birds!</p>
                <p>
                  {" "}
                  You counted a total of {yearStats.totalBirdsCounted} birds
                </p>
                <p>
                  {" "}
                  If you&apos;re curious, that&apos;s an average of about{" "}
                  {(
                    yearStats.totalBirdsCounted /
                    yearStats.totalTimeSpentMinutes
                  ).toFixed(2)}{" "}
                  birds per minute
                </p>
                <p> Here are the birds that topped the counts for the year</p>
                <ol>
                  {yearStats.mostObservedByTotalCount.map((species) => (
                    <li key={species.species}>
                      {species.species} ({species.totalCounts} sightings)
                    </li>
                  ))}
                </ol>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <p>You visited XXX_Unique_Hotspots in {CurrentYear}.</p>
                <p>But only one was your favorite...</p>
                <p>
                  <b>{yearStats.topHotspots[0].locationName}</b> with{" "}
                  {yearStats.topHotspots[0].checklistCount} checklists. You
                  spent a total of
                  {yearStats.topHotspots[0].timeSpentMinutes} minutes here.
                </p>
                <p>The runners up were...</p>
                <ol>
                  {yearStats.topHotspots.slice(1).map((hotspot, index) => (
                    <li key={hotspot.locationID} value={index + 2}>
                      {hotspot.locationName} ({hotspot.checklistCount}{" "}
                      checklists / {hotspot.timeSpentMinutes} minutes)
                    </li>
                  ))}
                </ol>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <p>Thanks for all the birds!</p>
                <b>Top Birds</b>
                <ol>
                  {yearStats.mostObservedByTotalCount.map((species) => (
                    <li key={species.species}>
                      {species.species} ({species.totalObservations} sightings)
                    </li>
                  ))}
                </ol>
                <b>Top Hotspots</b>
                <ol>
                  {yearStats.topHotspots.map((hotspot) => (
                    <li key={hotspot.locationID}>
                      {hotspot.locationName} ({hotspot.checklistCount}{" "}
                      checklists)
                    </li>
                  ))}
                </ol>
                <p>
                  New lifers: <b>{yearStats.newLifersCount}</b>
                </p>
                <p>
                  Total lifers now: <b>{chirpedObservations.lifeList.length}</b>
                </p>
                <button>
                  <b>Share!</b>
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <DebugSlide />
            </SwiperSlide>
          </>
        </Swiper>
      </ChirpedContext.Provider>
    </>
  );
}
