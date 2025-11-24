import {
  Dialog,
  DialogSurface,
  DialogTitle,
  TableRow,
} from "@fluentui/react-components";
type StatisticsTableRowProps = {};

function StatisticsTableRow(props: StatisticsTableRowProps) {
  return;
  <Dialog>
    <DialogTrigger>
      <TableRow>{children}</TableRow>
    </DialogTrigger>
    <DialogSurface>
      <DialogBody></DialogBody>
      <DialogTitle></DialogTitle>
      <DialogContent></DialogContent>
    </DialogSurface>
  </Dialog>;
}

export default StatisticsTableRow;
