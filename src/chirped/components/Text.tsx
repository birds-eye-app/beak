import { Typography, TypographyProps } from "@mui/material";
import { FadeInWithInitialDelay } from "./FadeWithInitialDelay";

export type TypographyWithFadeInProps = TypographyProps & {
  in?: boolean;
  timeout?: number;
  initialDelay: number;
};

export const TypographyWithFadeIn = (props: TypographyWithFadeInProps) => {
  return (
    <FadeInWithInitialDelay
      in={props.in}
      timeout={props.timeout}
      initialDelay={props.initialDelay}
    >
      <Typography {...props} />
    </FadeInWithInitialDelay>
  );
};
