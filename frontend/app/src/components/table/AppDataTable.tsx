import { IAppDataTableProps } from "../../types";
import { useAuth } from "../../provider/AuthProvider";
import AddButton from "../buttons/AddButton";
import TableRow from "./TableRow";

export interface Identifiable {
  _id: string;
}

function AppDataTable<T extends Identifiable>({
  tableName,
  columns,
  addButtonName,
  data,
  onAddButtonClick,
  onUpdateButtonClick,
  onDeleteButtonClick,
  onApproveButtonClick,
  onRejectButtonClick,
  onCancelButtonClick,
  onFixButtonClick,
  onFailureReportButtonClick,
}: IAppDataTableProps<T>) {
  const { currentUser } = useAuth();

  const isAddButtonDisabled =
    (currentUser?.role !== "admin" && tableName === "usersTable") ||
    (currentUser?.role === "admin" && tableName === "newReservationsTable");

  return (
    <div className="overflow-x-auto max-w-full tablet:mx-2 shadow-md bg-white">
      {/* Kontejner s horizontalnim scrollom */}
      <table className="min-w-full border border-gray-200 bg-white shadow-lg">
        <thead>
          {addButtonName && (
            <tr className="bg-gray-100">
              <th
                colSpan={8}
                className="py-3 font-semibold text-gray-600 text-right border-b border-gray-200 pr-4"
              >
                <AddButton
                  onClick={() => onAddButtonClick?.()}
                  isDisabled={isAddButtonDisabled}
                  buttonText={addButtonName}
                />
              </th>
            </tr>
          )}
          <tr className="bg-gray-100 text-center">
            {columns.map((column) => (
              <th
                key={column.key}
                className="py-3 px-6 font-bold text-gray-600 border-r border-gray-200"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <TableRow
              tableName={tableName}
              key={item._id}
              data={item}
              columns={columns}
              onUpdate={(item) => onUpdateButtonClick?.(item)}
              onDelete={(item) => onDeleteButtonClick?.(item)}
              onApprove={(item) => onApproveButtonClick?.(item)}
              onReject={(item) => onRejectButtonClick?.(item)}
              onCancel={(item) => onCancelButtonClick?.(item)}
              onFix={(item) => onFixButtonClick?.(item)}
              onFaliureReport={(item) => onFailureReportButtonClick?.(item)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppDataTable;
