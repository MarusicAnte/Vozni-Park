import AppDataTable from "../components/table/AppDataTable";
import { useLoaderData } from "react-router-dom";
import { IFilterSelectedOptions, ITableColumn, IVehicle } from "../types";
import { useEffect, useState } from "react";
import { applyVehicleFilter } from "../helpers/handleFilters";
import TableFilter from "../components/filters/TableFilter";
import {
  getAvailabilityOptions,
  getVehicleCategoryOptions,
} from "../helpers/getSelectOptions";

const vehicleTableColumns: Array<ITableColumn> = [
  { key: "imageURL", name: "Slika" },
  { key: "model", name: "Model" },
  { key: "year", name: "Godina" },
  { key: "category", name: "Kategorija" },
  { key: "vin", name: "Registracija" },
  { key: "isAvaiable", name: "Dostupnost" },
];

function VehicleList() {
  const { vehicles }: { vehicles: Array<IVehicle> } = useLoaderData();
  const [filteredVehicles, setFilteredVehicles] = useState<Array<IVehicle>>(
    vehicles || []
  );
  const [filterSelectedOptions, setFilterSelectedOptions] =
    useState<IFilterSelectedOptions>({
      vehicleCategory: { value: "", label: "", category: "" },
      availability: { value: "all", label: "Sve" },
    });

  useEffect(() => {
    applyVehicleFilter(vehicles, filterSelectedOptions, setFilteredVehicles);
  }, [filterSelectedOptions, vehicles]);

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-4 py-2 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista vozila
      </h1>
      <div className="flex gap-4 flex-col tablet:flex-row mb-4">
        <TableFilter
          label="Kategorija vozila"
          getFilterOptions={getVehicleCategoryOptions}
          setFunction={setFilterSelectedOptions}
        />
        <TableFilter
          label="Dostupnost"
          getFilterOptions={getAvailabilityOptions}
          setFunction={setFilterSelectedOptions}
        />
      </div>
      {filteredVehicles.length > 0 ? (
        <AppDataTable<IVehicle>
          tableName="vehiclesTable"
          columns={vehicleTableColumns}
          data={filteredVehicles}
        />
      ) : (
        <h1 className="text-2xl text-white font-semibold">Nema vozila</h1>
      )}
    </div>
  );
}

export default VehicleList;
