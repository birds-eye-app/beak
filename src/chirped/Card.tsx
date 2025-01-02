import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function OutlinedCard({
  justifyContent = "center",
  minHeight,
  children,
}: {
  justifyContent?: "center" | "flex-start" | "flex-end";
  minHeight?: number;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 400,
        minHeight: minHeight || 400,
        maxHeight: "80%",
        margin: 5,
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent,
            alignItems: "center",
            flex: 1,
            paddingBottom: 5,
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}
