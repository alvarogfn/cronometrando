import Statistics from "./components/statistics.tsx";
import QuestionStopwatch from "./components/stopwatch-question.tsx";
import StopwatchTest from "./components/stopwatch-test.tsx";
import FluentProvider from "./providers/fluent-provider.tsx";
import { makeStyles } from "@fluentui/react-components";

const useClasses = makeStyles({
  root: {
    height: "100vh",
    width: "100vw",
    maxWidth: "calc(100vw - 30px)",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    maxWidth: "1000px",
    display: "grid",
    gridTemplateAreas: "'a a b' 'a a b' 'c c c'",
    margin: "0 auto",
    width: "100%",
    flexFlow: "column wrap",
    gap: "10px",
  },
  testStopwatch: {
    gridArea: "b",
    flexGrow: 1,
  },
  questionStopwatch: {
    gridArea: "a",
  },
  statistics: {
    gridArea: "c",
  },
  gridItem: {
    width: "100%",
    height: "100%",
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
            <Statistics className={classes.statistics} />
          </div>
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
