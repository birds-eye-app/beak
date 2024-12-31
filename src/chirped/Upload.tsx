import { useState } from "react";
import ReactModal from "react-modal";
import { BarLoader } from "react-spinners";

export const UploadCSV = ({
  showModal,
  onUploadComplete,
}: {
  showModal: boolean;
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
    <ReactModal
      isOpen={showModal}
      contentLabel="WaitAndUploadModal"
      shouldCloseOnOverlayClick={true}
      style={{ overlay: { zIndex: 2 } }}
    >
      <div>
        <p>
          🐦🕰️ Welcome to Chirped! To get started, you&apos;ll need to upload
          your eBird CSV export. You can request an export from Cornell here:{" "}
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
    </ReactModal>
  );
};

ReactModal.setAppElement("#root");
