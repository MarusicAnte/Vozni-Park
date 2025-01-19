import { useState } from "react";
import AppDataTable from "../components/table/AppDataTable";
import { useLoaderData, useNavigate } from "react-router-dom";
import { IVehicleMalfunction } from "../types";
import AppConfirmModal from "../components/modals/AppConfirmModal";
import { fixVehicleMailfunction } from "../services/vehicleMalfunctionService";

interface ITableColumn {
  key: string;
  name: string;
}

const vehicleMalfunctionTableColumns: Array<ITableColumn> = [
  { key: "vehicle", name: "Vozilo" },
  { key: "description", name: "Kvar" },
  { key: "user", name: "Korisnik" },
  { key: "createdAt", name: "Datum" },
  { key: "manageOptions", name: "Opcije" },
];

function VehicleMalfunctionList() {
  const vehicleMalfunctions = useLoaderData();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [vehicleMalfunctionForFix, setVehicleMalfunctionForFix] =
    useState<IVehicleMalfunction>();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleFixVehicleMalfunction = (data: IVehicleMalfunction) => {
    setVehicleMalfunctionForFix(data);
    setModalOpen(true);
  };

  const handleFixSubmit = async () => {
    if (vehicleMalfunctionForFix) {
      const response = await fixVehicleMailfunction(
        vehicleMalfunctionForFix._id
      );
      if (response?.status === 200) {
        alert(response.data.message);
        setModalOpen(false);
        setVehicleMalfunctionForFix(undefined);
        navigate(".", { replace: true });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-4 py-2 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista kvarova vozila
      </h1>
      <AppConfirmModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Popravi kvar"
        message={`Klikom na botun "Popravi" kvar će se popraviti i vozilo ${vehicleMalfunctionForFix?.vehicle.model} će postati opet dostupno`}
        onSubmit={handleFixSubmit}
      />
      {vehicleMalfunctions.length > 0 ? (
        <AppDataTable<IVehicleMalfunction>
          tableName="vehicleMalfunctinsTable"
          columns={vehicleMalfunctionTableColumns}
          data={vehicleMalfunctions}
          onFixButtonClick={handleFixVehicleMalfunction}
        />
      ) : (
        <h1 className="text-2xl text-white font-semibold">
          Nema kvarova vozila
        </h1>
      )}
    </div>
  );
}

export default VehicleMalfunctionList;
