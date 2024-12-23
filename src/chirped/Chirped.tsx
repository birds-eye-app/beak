import { WaitAndUploadModal } from "../WaitAndUploadModal";
import { useState } from "react";
export function Chirped() {
  const [showUploadModal, setShowUploadModal] = useState(true);

  return (
    <div>
      <h1>Chirped</h1>
      <p>Welcome!</p>
      <WaitAndUploadModal
        showModal={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
        }}
        onUploadComplete={() => {}}
        canClose={false}
      />
    </div>
  );
}
