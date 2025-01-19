import { useLoaderData, useNavigate } from "react-router-dom";
import AppDataTable from "../components/table/AppDataTable";
import { IFilterSelectedOptions, IFinishedReservation } from "../types";
import AppDeleteModal from "../components/modals/AppDeleteModal";
import { useEffect, useState } from "react";
import { deleteFinishedReservationById } from "../services/finishedReservationService";
import { useAuth } from "../provider/AuthProvider";
import TableFilter from "../components/filters/TableFilter";
import {
  getUserOptions,
  getVehicleCategoryOptions,
  getVehicleOptions,
} from "../helpers/getSelectOptions";
import { applyReservationFilters } from "../helpers/handleFilters";

const finishedReservationTableColumns = [
  { key: "purpose", name: "Svrha" },
  { key: "period", name: "Period" },
  { key: "vehicleCategory", name: "Kategorija vozila" },
  { key: "vehicle", name: "Vozilo" },
  { key: "user", name: "Zaposlenik" },
  { key: "reasonForRejection", name: "Razlog odbijanja" },
  { key: "status", name: "Status" },
  { key: "manageOptions", name: "Opcije" },
];

function FinishedReservationList() {
  const finishedReservations: Array<IFinishedReservation> = useLoaderData();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [currentUserReservations, setCurrentUserReservations] = useState<
    Array<IFinishedReservation>
  >([]);

  const [filteredUserReservations, setFilteredUserReservations] = useState<
    Array<IFinishedReservation>
  >([]);

  const [filterSelectedOptions, setFilterSelectedOptions] =
    useState<IFilterSelectedOptions>({
      vehicleCategory: { value: "", label: "" },
      vehicle: { value: "", label: "", category: "" },
      user: { value: "", label: "" },
    });

  useEffect(() => {
    if (currentUser?.role === "zaposlenik") {
      const filteredData = finishedReservations?.filter(
        (reservation) => reservation.user._id === currentUser?._id
      );
      setCurrentUserReservations(filteredData);
      setFilteredUserReservations(filteredData);
    } else {
      setCurrentUserReservations(finishedReservations);
      setFilteredUserReservations(finishedReservations);
    }
  }, []);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [reservationForDelete, setReservationForDelete] =
    useState<IFinishedReservation>();

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setReservationForDelete(undefined);
  };

  const handleDeleteClick = (data: IFinishedReservation) => {
    setIsOpenModal(true);
    setReservationForDelete(data);
  };

  const handleDeleteReservation = async () => {
    const reservationId = reservationForDelete?._id;

    if (!reservationId) return;

    try {
      const response = await deleteFinishedReservationById(reservationId);
      if (response?.status === 200) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setIsOpenModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
  }, [filterSelectedOptions, finishedReservations]);

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-2 py-4 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista isteklih rezervacija
      </h1>
      <AppDeleteModal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onDelete={handleDeleteReservation}
        title="Izbriši isteklu rezervaciju"
        message={`Jeste li sigurni da želite izbrisati rezervaciju: ${reservationForDelete?.purpose}:`}
      />
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
      {filteredUserReservations && filteredUserReservations.length > 0 ? (
        <AppDataTable<IFinishedReservation>
          tableName="finishedReservationsTable"
          columns={finishedReservationTableColumns}
          data={filteredUserReservations}
          onDeleteButtonClick={handleDeleteClick}
        />
      ) : (
        <h1 className="text-2xl text-white font-semibold">
          Nema isteklih rezervacija
        </h1>
      )}
    </div>
  );
}

export default FinishedReservationList;
