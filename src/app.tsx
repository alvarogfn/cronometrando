import { makeStyles } from "@fluentui/react-components";

import StatisticsTable from "components/statistics-table.tsx";
import QuestionStopwatch from "./components/stopwatch-question.tsx";
import StopwatchTest from "./components/stopwatch-test.tsx";
import FluentProvider from "./providers/fluent-provider.tsx";
import ConfigurationMenu from "components/configuration-menu.tsx";

const useClasses = makeStyles({
  config: {
    gridArea: "c",
  },
  container: {
    display: "grid",
    flexFlow: "column wrap",
    gap: "10px",
    gridTemplateAreas: "'a a b' 'a a b' 'c c c' 'd d d'",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "100px 100px 1fr",
    margin: "0 auto",
    maxWidth: "1000px",
    width: "100%",
  },
  gridItem: {
    height: "100%",
    width: "100%",
  },
  questionStopwatch: {
    gridArea: "a",
  },
  root: {
    alignItems: "center",
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    margin: "0 auto",
    maxWidth: "calc(100vw - 30px)",
    width: "100vw",
  },
  statistics: {
    gridArea: "d",
  },
  testStopwatch: {
    flexGrow: 1,
    gridArea: "b",
  },
});

function App() {
  const classes = useClasses();
  return (
    <FluentProvider>
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.questionStopwatch}>
            <QuestionStopwatch className={classes.gridItem} />
          </div>
          <div className={classes.testStopwatch}>
            <StopwatchTest className={classes.gridItem} />
          </div>
          <div className={classes.statistics}>
            <StatisticsTable className={classes.gridItem} />
          </div>
          <div className={classes.config}>
            <ConfigurationMenu className={classes.gridItem} />
          </div>
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
