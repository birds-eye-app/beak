import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { forwardRef } from "react";

const OutlinedCard = forwardRef(function OutlinedCard(
  {
    justifyContent = "center",
    minHeight,
    children,
    disableScroll = false,
    maxHeight = "80%",
  }: {
    justifyContent?: "center" | "flex-start" | "flex-end";
    minHeight?: number;
    children: React.ReactNode;
    disableScroll?: boolean;
    maxHeight?: number | string;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: 400,
        minHeight: minHeight || 400,
        maxHeight: maxHeight,
        margin: 5,
      }}
      ref={ref}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          overflowY: disableScroll ? "hidden" : "auto",
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
});

export default OutlinedCard;
