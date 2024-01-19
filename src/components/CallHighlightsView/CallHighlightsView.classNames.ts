import { mergeStyleSets } from "@fluentui/merge-styles";
import { getTheme } from "@fluentui/react";

const theme = getTheme();

export interface CallHighlightsViewClassNames {
  area: string;
}

export const getClassNames = (): CallHighlightsViewClassNames => {
  return mergeStyleSets({
    area: {
      backgroundColor: theme.palette.neutralLighter,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 24,
      paddingRight: 24,
    }
  });
};
