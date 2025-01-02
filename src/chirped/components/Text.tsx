import { Fade, Typography, TypographyProps } from "@mui/material";

export const TypographyWithFadeIn = (props: TypographyProps) => {
  return (
    <Fade in timeout={500}>
      <Typography {...props} />
    </Fade>
  );
};
