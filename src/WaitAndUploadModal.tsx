import ReactModal from "react-modal";
import { checkHealthy, uploadCsv } from "./api";
import { useState } from "react";

export const WaitAndUploadModal = ({
  showModal,
  onClose,
  onUploadComplete,
  canClose,
}: {
  showModal: boolean;
  onClose: () => void;
  onUploadComplete: (key: string) => void;
  canClose: boolean;
}) => {
  const [healthCheck, setHealthCheck] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      const { key } = await uploadCsv(e.target.files[0]);
      setUploading(false);
      onUploadComplete(key);
    }
  };

  checkHealthy().then(setHealthCheck);

  return (
    <ReactModal isOpen={showModal} contentLabel="WaitAndUploadModal">
      <button onClick={onClose} disabled={!canClose}>
        Close
      </button>
      <p>
        🦉👁️ Welcome to Birdseye! To get started, you'll need to upload your
        eBird CSV export. You can request an export from Cornell here:{" "}
        <a href="https://ebird.org/downloadMyData" target="_blank">
          https://ebird.org/downloadMyData
        </a>
      </p>
      <div>
        {uploading && (<div>
          <p>📡 Uploading... this might take a minute or 2.</p>
          </div>)}
        {healthCheck === null &&
          "🛌 Waiting to hear from the server... this might take a minute or 2 if it's starting up. (Seriously!)"}
        {healthCheck === false &&
          "🚨 Server is unhealthy! Please try again later."}
        {healthCheck === true && (
          <>
            <label htmlFor="file">📄 Upload your eBird export here:</label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              accept=".csv"
            />
          </>
        )}
      </div>

      <br />
    </ReactModal>
  );
};

ReactModal.setAppElement("#root");