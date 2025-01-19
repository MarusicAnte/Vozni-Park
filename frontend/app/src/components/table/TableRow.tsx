import { ITableRow } from "../../types";
import { useAuth } from "../../provider/AuthProvider";

function TableRow<T>({
  tableName,
  data,
  columns,
  onUpdate,
  onDelete,
  onApprove,
  onReject,
  onCancel,
  onFix,
  onFaliureReport,
}: ITableRow<T>) {
  const { currentUser } = useAuth();

  const renderButtons = () => {
    if (tableName === "usersTable") {
      return currentUser?.role === "admin" ? (
        <>
          {onUpdate && (
            <button
              onClick={() => onUpdate(data)}
              className="bg-cyan-700 text-white text-md font-semibold px-4 py-2 rounded-sm"
            >
              Uredi
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(data)}
              className="bg-red-700 text-white font-semibold px-2 py-1 rounded-sm"
            >
              Izbriši
            </button>
          )}
        </>
      ) : (
        <img src="../../public/images/forbidden.png" alt="forbidden-img" />
      );
    }

    if (tableName === "newReservationsTable") {
      return currentUser?.role === "admin" ? (
        <>
          {onApprove && (
            <button
              onClick={() => onApprove(data)}
              className="bg-green-600 text-white text-md font-semibold px-4 py-2 rounded-sm"
            >
              Odobri
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(data)}
              className="bg-red-700 text-white font-semibold px-4 py-2 rounded-sm"
            >
              Odbij
            </button>
          )}
        </>
      ) : (
        <>
          {onCancel && (
            <button
              onClick={() => onCancel(data)}
              className="bg-red-600 text-white text-md font-semibold px-4 py-2 rounded-sm"
            >
              Otkaži
            </button>
          )}
        </>
      );
    }

    if (tableName === "finishedReservationsTable") {
      return currentUser?.role === "admin" ? (
        <button
          onClick={() => onDelete?.(data)}
          className={`bg-red-700 text-white font-semibold px-2 py-1 rounded-sm ${
            currentUser?.role !== "admin" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Izbriši
        </button>
      ) : (
        <img src="../../public/images/forbidden.png" alt="forbidden-img" />
      );
    }

    if (tableName === "vehicleMalfunctinsTable") {
      return currentUser?.role === "admin" ? (
        <button
          onClick={() => onFix?.(data)}
          className={`bg-cyan-900 text-white font-semibold px-2 py-1 rounded-sm ${
            currentUser?.role !== "admin" ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Popravi
        </button>
      ) : (
        <img src="../../public/images/forbidden.png" alt="forbidden-img" />
      );
    }

    if (tableName === "approvedReservationsTable") {
      return currentUser?.role === "zaposlenik" ? (
        <button
          onClick={() => onFaliureReport?.(data)}
          className={`bg-red-700 text-white font-semibold px-2 py-1 rounded-sm ${
            currentUser?.role !== "zaposlenik"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Prijavi kvar
        </button>
      ) : (
        <img src="../../public/images/forbidden.png" alt="forbidden-img" />
      );
    }

    return null;
  };

  return (
    <tr className="bg-white hover:bg-gray-100 border-b border-gray-200 text-center">
      {columns.map((column) => (
        <td
          key={column.key}
          className={
            column.key === "imageURL"
              ? "py-4 px-4 text-sm text-gray-700 border-r border-gray-200 flex items-center justify-center phone:h-full phone:flex phone:items-center phone:justify-center"
              : "py-4 px-4 text-sm text-gray-700 border-r border-gray-200"
          }
        >
          {column.key === "imageURL" ? (
            <img
              src={(data as any)[column.key]}
              alt="Item"
              className={`${
                tableName === "vehiclesTable"
                  ? "w-fit h-24 object-cover tablet:w-16 tablet:h-16 phone:w-10 phone:h-10"
                  : "w-16 h-16 object-cover rounded-full"
              }`}
            />
          ) : column.key === "manageOptions" ? (
            <div className="flex justify-center gap-4">{renderButtons()}</div>
          ) : column.key === "isAvaiable" ? (
            (data as any)[column.key] ? (
              "Dostupno"
            ) : (
              "Nedostupno"
            )
          ) : column.key === "category" || column.key === "vehicleCategory" ? (
            (data as any)[column.key]?.name || "/"
          ) : column.key === "user" ? (
            (data as any)[column.key]?.email || "/"
          ) : column.key === "period" ? (
            `${new Date(
              (data as any)[column.key]?.start
            ).toLocaleDateString()} - ${new Date(
              (data as any)[column.key]?.end
            ).toLocaleDateString()}`
          ) : column.key === "vehicle" ? (
            (data as any)[column.key]?.model || "/"
          ) : column.key === "reasonForRejection" ? (
            (data as any)[column.key] || "/"
          ) : column.key === "createdAt" ? (
            new Date((data as any)[column.key]).toLocaleDateString()
          ) : (
            (data as any)[column.key]
          )}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;
