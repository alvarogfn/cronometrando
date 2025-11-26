import type { BaseProps } from "helpers/base-props";

import {
  Card,
  makeStyles,
  mergeClasses,
  ToggleButton,
} from "@fluentui/react-components";
import { useStopwatchStore } from "api/store.ts";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexFlow: "row no-wrap",
  },
});

interface ConfigurationMenuProps extends BaseProps {}

function ConfigurationMenu({ className }: ConfigurationMenuProps) {
  const classes = useStyles();

  const autoShutdown = useStopwatchStore((state) => state.autoShutdown);
  const setAutoShutdown = useStopwatchStore((state) => state.setAutoShutdown);

  const handleInput = () => {
    setAutoShutdown(!autoShutdown);
  };

  return (
    <Card className={mergeClasses(className, classes.container)}>
      <ToggleButton as="button" checked={autoShutdown} onClick={handleInput}>
        Auto-encerrar
      </ToggleButton>
    </Card>
  );
}

export default ConfigurationMenu;
