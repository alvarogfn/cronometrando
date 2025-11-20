import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Card,
} from "@fluentui/react-components";
import type { BaseProps } from "../helpers/base-props.ts";
import useTestFindAll from "hooks/use-test-find-all.ts";

const columns = [
  { columnKey: "id", label: "ID" },
  { columnKey: "average", label: "Média" },
  { columnKey: "longerTime", label: "Maior duração" },
  { columnKey: "shorterTime", label: "Menor duração" },
  { columnKey: "quantity", label: "Quantidade" },
  { columnKey: "date", label: "Dia e Hora" },
];

interface StatisticsProps extends BaseProps {}

function Statistics({ className }: StatisticsProps) {
  const { data, isLoading } = useTestFindAll();

  return (
    <Card className={className}>
      <Table style={{ minWidth: 400, overflowY: "scroll" }}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.columnKey}>
                {column.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody style={{ maxHeight: 100 }}>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>#{item.id}</TableCell>
              <TableCell>null</TableCell>
              <TableCell>null</TableCell>
              <TableCell>null</TableCell>
              <TableCell>null</TableCell>
              <TableCell>
                {new Date(item.endedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default Statistics;
