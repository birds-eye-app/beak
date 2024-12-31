import { useState } from "react";
import { BarLoader } from "react-spinners";

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
    <div>
      <h1>Chirped</h1>
      <p>Welcome!</p>
      <p>
        🐦🕰️ Welcome to Chirped! To get started, you&apos;ll need to upload your
        eBird CSV export. You can request an export from eBird here:{" "}
        <a
          href="https://ebird.org/downloadMyData"
          target="_blank"
          rel="noreferrer"
        >
          https://ebird.org/downloadMyData
        </a>
      </p>
      <div>
        {processing && (
          <div>
            <BarLoader width={50} />
            <p>📡 Processing todo... this might take a minute or 2.</p>
          </div>
        )}
        {!processing && (
          <>
            <label htmlFor="file">📄 Upload your eBird export here:</label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              accept=".csv"
              disabled={processing}
            />
          </>
        )}
      </div>

      <br />
    </div>
  );
};

export default UploadCSV;
