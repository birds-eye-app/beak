import { useState } from "react";
import { BarLoader } from "react-spinners";
import OutlinedCard from "../Card";
import { Typography } from "@mui/material";

const UploadCSV = ({
  onUploadComplete,
}: {
  onUploadComplete: (contents: string) => void;
}) => {
  const [processing, setProcessing] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProcessing(true);
      setProcessing(false);
      onUploadComplete(await e.target.files[0].text());
    }
  };

  return (
    <OutlinedCard>
      <Typography
        gutterBottom
        sx={{
          fontSize: 24,
        }}
      >
        Welcome!
      </Typography>
      <Typography
        gutterBottom
        sx={{
          fontSize: 14,
          color: "text.primary",
        }}
      >
        🐦🕰️ Welcome to Chirped! To get started, you&apos;ll need to upload your
        eBird CSV export. You can request an export from eBird here:{" "}
        <a
          href="https://ebird.org/downloadMyData"
          target="_blank"
          rel="noreferrer"
        >
          https://ebird.org/downloadMyData
        </a>
      </Typography>
      <div>
        {processing && (
          <div>
            <BarLoader width={50} />
            <Typography gutterBottom>
              📡 Processing todo... this might take a minute or 2.
            </Typography>
          </div>
        )}
        <label htmlFor="file">
          <Typography
            gutterBottom
            sx={{
              fontSize: 14,
              color: "text.secondary",
            }}
          >
            📄 Upload your eBird export here:
          </Typography>
        </label>
        <input
          id="file"
          name="file"
          type="file"
          onChange={handleFileChange}
          accept=".csv"
          disabled={processing}
        />
      </div>

      <br />
    </OutlinedCard>
  );
};

export default UploadCSV;
