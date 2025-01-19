import { useLoaderData, useNavigate } from "react-router-dom";
import {
  IApprovedReservation,
  IFilterSelectedOptions,
  IFormField,
  IVehicleMalfunctionCreateDto,
} from "../types";
import AppDataTable from "../components/table/AppDataTable";
import { useAuth } from "../provider/AuthProvider";
import { useEffect, useState } from "react";
import TableFilter from "../components/filters/TableFilter";
import {
  getUserOptions,
  getVehicleCategoryOptions,
  getVehicleOptions,
} from "../helpers/getSelectOptions";
import { applyReservationFilters } from "../helpers/handleFilters";
import AppModal from "../components/modals/AppModal";
import { createVehicleMalfunction } from "../services/vehicleMalfunctionService";

const approvedReservationTableColumns = [
  { key: "purpose", name: "Svrha" },
  { key: "period", name: "Period" },
  { key: "vehicleCategory", name: "Kategorija vozila" },
  { key: "vehicle", name: "Vozilo" },
  { key: "user", name: "Zaposlenik" },
  { key: "status", name: "Status" },
  { key: "manageOptions", name: "Opcije" },
];

const vehicleMalfunctionFormSchemaTemplate: Array<IFormField> = [
  {
    label: "Opis kvara",
    name: "description",
    type: "input",
    placeholder: "Opis kvara...",
    value: "",
    onChange: () => {},
  },
];

function ApprovedReservationList() {
  const approvedReservations: Array<IApprovedReservation> = useLoaderData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentUserReservations, setCurrentUserReservations] = useState<
    Array<IApprovedReservation>
  >([]);

  const [filteredUserReservations, setFilteredUserReservations] = useState<
    Array<IApprovedReservation>
  >([]);

  const [reservationForReort, setReservationForReport] =
    useState<IApprovedReservation | null>();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [filterSelectedOptions, setFilterSelectedOptions] =
    useState<IFilterSelectedOptions>({
      vehicleCategory: { value: "", label: "" },
      vehicle: { value: "", label: "", category: "" },
      user: { value: "", label: "" },
    });

  useEffect(() => {
    if (currentUser?.role === "zaposlenik") {
      const filteredData = approvedReservations.filter(
        (reservation) => reservation.user._id === currentUser?._id
      );
      setCurrentUserReservations(filteredData);
      setFilteredUserReservations(filteredData);
    } else {
      setCurrentUserReservations(approvedReservations);
      setFilteredUserReservations(approvedReservations);
    }
  }, [approvedReservations]);

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
  }, [filterSelectedOptions, approvedReservations]);

  const handleReportVehicleMalfunction = (data: IApprovedReservation) => {
    setReservationForReport(data);
    setModalOpen(true);
  };

  const handleCreateVehcileMalfunction = async (data: Record<string, any>) => {
    if (reservationForReort) {
      const vehicleId = reservationForReort.vehicle._id;

      const newVehicleMalfunction: IVehicleMalfunctionCreateDto = {
        vehicle: reservationForReort.vehicle._id,
        description: data.description,
        user: reservationForReort.user._id,
      };

      const response = await createVehicleMalfunction(
        vehicleId,
        newVehicleMalfunction
      );

      if (response?.status === 201) {
        alert(response.data.message);
        setReservationForReport(null);
        setModalOpen(false);
        navigate(".", { replace: true });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-2 py-4 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista odobrenih rezervacija
      </h1>
      <div className="flex gap-4 flex-col tablet:flex-row mb-4">
        <TableFilter
          label="Kategorija vozila"
          getFilterOptions={getVehicleCategoryOptions}
          setFunction={setFilterSelectedOptions}
        />

        <TableFilter
          label="Vozilo"
          getFilterOptions={() =>
            getVehicleOptions(filterSelectedOptions.vehicleCategory?.value)
          }
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
      <AppModal
        isOpen={isModalOpen}
        title="Prijava kvara"
        formSchema={vehicleMalfunctionFormSchemaTemplate}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateVehcileMalfunction}
      />
      {filteredUserReservations && filteredUserReservations.length > 0 ? (
        <AppDataTable<IApprovedReservation>
          columns={approvedReservationTableColumns}
          data={filteredUserReservations}
          tableName="approvedReservationsTable"
          onFailureReportButtonClick={handleReportVehicleMalfunction}
        />
      ) : (
        <h1 className="text-2xl text-white font-semibold">
          Nema odobrenih rezervacija
        </h1>
      )}
    </div>
  );
}

export default ApprovedReservationList;
