import { useLoaderData } from "react-router-dom";
import AppDataTable from "../components/table/AppDataTable";
import { IFilterSelectedOptions, IRejectedReservation } from "../types";
import { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import TableFilter from "../components/filters/TableFilter";
import {
  getUserOptions,
  getVehicleCategoryOptions,
} from "../helpers/getSelectOptions";
import { applyReservationFilters } from "../helpers/handleFilters";

const rejectedReservationTableColumns = [
  { key: "purpose", name: "Svrha" },
  { key: "period", name: "Period" },
  { key: "vehicleCategory", name: "Kategorija vozila" },
  { key: "user", name: "Zaposlenik" },
  { key: "status", name: "Status" },
  { key: "reasonForRejection", name: "Razlog odbijanja" },
];

function RejectedReservationList() {
  const rejectedReservations: Array<IRejectedReservation> = useLoaderData();
  const { currentUser } = useAuth();

  const [currentUserReservations, setCurrentUserResevations] = useState<
    Array<IRejectedReservation>
  >([]);

  const [filteredUserReservations, setFilteredUserReservations] = useState<
    Array<IRejectedReservation>
  >([]);

  const [filterSelectedOptions, setFilterSelectedOptions] =
    useState<IFilterSelectedOptions>({
      vehicleCategory: { value: "", label: "" },
      vehicle: { value: "", label: "", category: "" },
      user: { value: "", label: "" },
    });

  useEffect(() => {
    if (currentUser?.role === "zaposlenik") {
      const filteredData = rejectedReservations?.filter(
        (reservation) => reservation.user._id === currentUser?._id
      );
      setCurrentUserResevations(filteredData);
      setFilteredUserReservations(filteredData);
    } else {
      setCurrentUserResevations(rejectedReservations);
      setFilteredUserReservations(rejectedReservations);
    }
  }, []);

  useEffect(() => {
    if (currentUserReservations.length === 0) {
      return;
    }

    if (
      !filterSelectedOptions.vehicleCategory &&
      !filterSelectedOptions.user &&
      !filterSelectedOptions.vehicle
    ) {
      setFilteredUserReservations(currentUserReservations);
      return;
    }

    applyReservationFilters(
      currentUserReservations,
      filterSelectedOptions,
      setFilteredUserReservations
    );
  }, [filterSelectedOptions, rejectedReservations]);

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-2 py-4 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista odbijenih rezervacija
      </h1>
      <div className="flex gap-4 flex-col tablet:flex-row mb-4">
        <TableFilter
          label="Kategorija vozila"
          getFilterOptions={getVehicleCategoryOptions}
          setFunction={setFilterSelectedOptions}
        />

        {currentUser?.role === "admin" && (
          <TableFilter
            label="Korisnik"
            getFilterOptions={getUserOptions}
            setFunction={setFilterSelectedOptions}
          />
        )}
      </div>
      {filteredUserReservations && filteredUserReservations.length > 0 ? (
        <AppDataTable<IRejectedReservation>
          columns={rejectedReservationTableColumns}
          data={filteredUserReservations}
        />
      ) : (
        <h1 className="text-2xl text-white font-semibold">
          Nema odbijenih rezervacija
        </h1>
      )}
    </div>
  );
}

export default RejectedReservationList;
