import { Button, styled, Typography } from "@mui/material";
import OutlinedCard from "../Card";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadCSV = ({
  onUploadComplete,
}: {
  onUploadComplete: (contents: string) => void;
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
      >
        📄 Upload eBird CSV
        <VisuallyHiddenInput type="file" onChange={handleFileChange} multiple />
      </Button>
    </OutlinedCard>
  );
};

export default UploadCSV;
