import Stopwatch from "./components/stopwatch.tsx";
import FluentProvider from "./providers/fluent-provider.tsx";
import { Card, makeStyles } from "@fluentui/react-components";

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
    maxWidth: "800px",
    display: "grid",
    gridAutoColumns: "6fr 4fr",
    gridAutoRows: "8fr 2fr",
    gridAutoFlow: "row",
    margin: "0 auto",
    width: "100%",
    flexWrap: "wrap",
    gap: "20px",
  },
  testStopwatch: {
    gridColumn: "1 / 2",
    gridRow: "1 / 3",
  },
  questionStopwatch: {
    gridColumn: "2 / 3",
    gridRow: "1 / 2",
  },
  statistics: {
    gridColumn: "2 / 3",
    gridRow: "2 / 3",
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
          <div className={classes.testStopwatch}>
            <Stopwatch title="Prova" className={classes.gridItem} />
          </div>
          <div className={classes.questionStopwatch}>
            <Stopwatch title="Questão" className={classes.gridItem} />
          </div>
          <div className={classes.statistics}>
            <Card className={classes.gridItem} />
          </div>
        </div>
      </div>
    </FluentProvider>
  );
}

export default App;
