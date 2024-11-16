import { useState } from "react";
import { SpeciesFilter, VisibleSpeciesWithLocation } from "./App";

export const SpeciesSelectionList = ({
  visibleSpeciesWithLocation,
  onUpdateToCheckedCodes,
}: {
  visibleSpeciesWithLocation: VisibleSpeciesWithLocation;
  onUpdateToCheckedCodes: (filter: SpeciesFilter) => void;
}) => {
  const allCodes = Object.keys(visibleSpeciesWithLocation);
  const [checkedCodes, setCheckedCodes] = useState<SpeciesFilter>("all");
  const updateCode = (code: string) => {
    if (checkedCodes === "all") {
      // if it's currently all codes, we now want to remove this code
      setCheckedCodes(allCodes.filter((c) => c !== code));
    } else if (
      typeof checkedCodes === "object" &&
      checkedCodes.includes(code)
    ) {
      setCheckedCodes(checkedCodes.filter((c) => c !== code));
    } else {
      setCheckedCodes([...checkedCodes, code]);
    }
  };

  return (
    <div className="right-species-bar">
      <div className="checkbox-group">
        <button
          onClick={() =>
            setCheckedCodes(Object.keys(visibleSpeciesWithLocation))
          }
        >
          All
        </button>
        <button onClick={() => setCheckedCodes([])}>None</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => onUpdateToCheckedCodes(checkedCodes)}>
          Confirm
        </button>
        <button
          onClick={() => {
            onUpdateToCheckedCodes("all");
            setCheckedCodes("all");
          }}
        >
          Reset
        </button>
      </div>
      <div>
        <h2>
          {allCodes.length} species |{" "}
          {Object.values(visibleSpeciesWithLocation)
            .flatMap((x) => x.lifers.length)
            .reduce((a, b) => a + b, 0)}{" "}
          observations
        </h2>
      </div>
      <div className="checkbox-scroll-list">
        {Object.entries(visibleSpeciesWithLocation).map(([code, info]) => (
          <div key={code}>
            <input
              type="checkbox"
              checked={checkedCodes === "all" || checkedCodes.includes(code)}
              id={code}
              name={code}
              value={info.species.common_name}
              onChange={() => {
                updateCode(code);
              }}
            />
            <label htmlFor={code}>
              {info.species.common_name} - <span>{info.lifers.length}</span> obs
              / {new Set(info.lifers.map((lifer) => lifer.location_id)).size}{" "}
              location(s)
            </label>
            {/* add link to show only this species */}
            <button
              onClick={() => {
                setCheckedCodes([code]);
              }}
            >
              Only
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
