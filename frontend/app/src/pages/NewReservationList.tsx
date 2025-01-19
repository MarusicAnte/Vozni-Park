import { useLoaderData, useNavigate } from "react-router-dom";
import AppDataTable from "../components/table/AppDataTable";
import {
  IApprovedReservation,
  IApprovedReservationDTO,
  IFilterSelectedOptions,
  IFormField,
  INewReservation,
  IRejectedReservationDto,
} from "../types";
import { useEffect, useState } from "react";
import AppModal from "../components/modals/AppModal";
import {
  approveNewReservation,
  cancelNewReservation,
  createNewReservation,
  rejectNewReservation,
} from "../services/newReservationService";
import { useAuth } from "../provider/AuthProvider";
import AppCancelModal from "../components/modals/AppCancelModal";
import AddButton from "../components/buttons/AddButton";
import { getApprovedReservations } from "../services/approvedReservationService";
import TableFilter from "../components/filters/TableFilter";
import {
  getUserOptions,
  getVehicleCategoryOptions,
  getVehicleOptions,
} from "../helpers/getSelectOptions";
import { applyReservationFilters } from "../helpers/handleFilters";

const newReservationTableColumns = [
  { key: "purpose", name: "Svrha" },
  { key: "period", name: "Period" },
  { key: "vehicleCategory", name: "Kategorija vozila" },
  { key: "user", name: "Zaposlenik" },
  { key: "status", name: "Status" },
  { key: "manageOptions", name: "Opcije" },
];

const newReservationFormTemplateSchema: Array<IFormField> = [
  {
    label: "Svrha",
    name: "purpose",
    type: "input",
    placeholder: "Unesite svrhu rezervacije",
    value: "",
    onChange: () => {},
  },
  {
    label: "Kategorija vozila",
    name: "vehicleCategory",
    type: "select",
    options: [],
    value: "",
    onChange: () => {},
  },
  {
    label: "Početak",
    name: "start",
    type: "date",
    placeholder: "",
    value: "",
    onChange: () => {},
  },
  {
    label: "Kraj",
    name: "end",
    type: "date",
    placeholder: "",
    value: "",
    onChange: () => {},
  },
];

const approveNewReservationTemplateSchema: Array<IFormField> = [
  {
    label: "Kategorija vozila",
    name: "vehicleCategory",
    type: "select",
    getOptions: getVehicleCategoryOptions,
    value: "",
    onChange: () => {},
  },
  {
    label: "Vozilo",
    name: "vehicle",
    type: "select",
    getOptions: getVehicleOptions,
    value: "",
    onChange: () => {},
  },
  {
    label: "Dostupnost vozila",
    name: "vehicleAvailability",
    type: "calendar",
    placeholder: "Odaberite datume",
    disabledDates: [],
    value: "",
    onChange: () => {},
  },
];

const rejectNewReservationTemplateSchema: Array<IFormField> = [
  {
    label: "Razlog odbijanja",
    name: "reasonForRejection",
    type: "input",
    placeholder: "Razlog odbijanja...",
    value: "",
    onChange: () => {},
  },
];

function NewReservationList() {
  const newReservations: Array<INewReservation> = useLoaderData();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [reservationToCancel, setReservationToCancel] =
    useState<INewReservation | null>(null);
  const [modalType, setModalType] = useState<
    "add" | "approve" | "cancel" | "reject" | null
  >(null);
  const [vehicleCategory, setVehicleCategory] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [approveFormSchema, setApproveFormSchema] = useState<IFormField[]>(
    approveNewReservationTemplateSchema
  );
  const [addFormSchema, setAddFormSchema] = useState<IFormField[]>(
    newReservationFormTemplateSchema
  );
  const [reservationForUpdate, setReservationForUpdate] =
    useState<INewReservation | null>(null);
  const [reservationForReject, setReservationForReject] =
    useState<INewReservation | null>(null);
  const [approvedReservations, setApprovedReservations] = useState<
    Array<IApprovedReservation>
  >([]);
  const [currentUserReservations, setCurrentUserReservations] = useState<
    Array<INewReservation>
  >([]);
  const [filteredUserReservations, setFilteredUserReservations] = useState<
    Array<INewReservation>
  >([]);
  const [filterSelectedOptions, setFilterSelectedOptions] =
    useState<IFilterSelectedOptions>({
      vehicleCategory: { value: "", label: "" },
      user: { value: "", label: "" },
    });

  const getApprovedReservationsData = async () => {
    try {
      const data = await getApprovedReservations();
      if (data) {
        setApprovedReservations(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "zaposlenik") {
      const filteredData = newReservations?.filter(
        (reservation) => reservation.user._id === currentUser?._id
      );
      setCurrentUserReservations(filteredData);
      setFilteredUserReservations(filteredData || []);
    } else {
      setCurrentUserReservations(newReservations);
      setFilteredUserReservations(newReservations || []);
    }

    getApprovedReservationsData();
  }, [newReservations]);

  const handleAddReservation = async () => {
    setModalType("add");

    const vehicleCategories = await getVehicleCategoryOptions();

    setAddFormSchema((prev) =>
      prev.map((field) => {
        if (field.name === "vehicleCategory") {
          return {
            ...field,
            options: vehicleCategories,
          };
        }
        return field;
      })
    );
  };

  const handleApproveReservation = async (data: INewReservation) => {
    setModalType("approve");
    setVehicleCategory(data.vehicleCategory._id);

    const vehicles = await getVehicleOptions(data.vehicleCategory._id);
    const vehicleCategories = await getVehicleCategoryOptions();

    setApproveFormSchema((prev) =>
      prev.map((field) => {
        if (field.name === "vehicleCategory") {
          return {
            ...field,
            options: vehicleCategories,
            value: data.vehicleCategory._id,
            disabled: true,
          };
        }
        if (field.name === "vehicle") {
          return {
            ...field,
            options: vehicles,
          };
        }
        return field;
      })
    );

    setReservationForUpdate(data);
    setPurpose(data.purpose);
  };

  const handleRejectReservation = (data: INewReservation) => {
    setModalType("reject");
    setReservationForReject(data);
  };

  const handleCancelReservation = (data: INewReservation) => {
    setModalType("cancel");
    setReservationToCancel(data);
    setPurpose(data.purpose);
  };

  const confirmCancelReservation = async () => {
    if (reservationToCancel) {
      const response = await cancelNewReservation(reservationToCancel._id);
      if (response?.status === 200) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setModalType(null);
      }
    }

    setReservationToCancel(null);
  };

  const handleModalClose = () => setModalType(null);

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const updatedFormData = {
        purpose: formData.purpose,
        vehicleCategory: formData.vehicleCategory,
        period: {
          start: formData.start,
          end: formData.end,
        },
        user: currentUser?._id,
        status: "Na čekanju",
      };
      const response = await createNewReservation(updatedFormData);
      if (response?.status === 201) {
        alert(response.data.message);
        setModalType(null);
        navigate(".", { replace: true });
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleApproveNewReservation = async (formData: Record<string, any>) => {
    if (!reservationForUpdate) return;

    const reservationId = reservationForUpdate._id;
    try {
      const newData: IApprovedReservationDTO = {
        _id: reservationId,
        purpose: reservationForUpdate.purpose,
        period: {
          start: reservationForUpdate.period.start,
          end: reservationForUpdate.period.end,
        },
        vehicleCategory: formData.vehicleCategory,
        status: "Odobreno",
        user: reservationForUpdate.user._id,
        vehicle: formData.vehicle,
      };

      const response = await approveNewReservation(reservationId, newData);
      if (response?.status === 200) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setModalType(null);
      }
    } catch (error) {
      console.error("Greška prilikom odobravanja rezervacije:", error);
      alert("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  const handleRejectNewReservation = async (formdata: Record<string, any>) => {
    if (!reservationForReject) return;

    const reservationId = reservationForReject._id;
    try {
      const newData: IRejectedReservationDto = {
        _id: reservationId,
        purpose: reservationForReject.purpose,
        period: {
          start: reservationForReject.period.start,
          end: reservationForReject.period.end,
        },
        vehicleCategory: reservationForReject.vehicleCategory._id,
        status: "Odbijeno",
        user: reservationForReject.user._id,
        reasonForRejection: formdata.reasonForRejection,
      };

      const response = await rejectNewReservation(reservationId, newData);
      if (response?.status === 200) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setModalType(null);
      }
    } catch (error) {
      console.error("Greška prilikom odobravanja rezervacije:", error);
      alert("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  useEffect(() => {
    if (currentUserReservations.length === 0) return;

    if (!filterSelectedOptions.vehicleCategory && !filterSelectedOptions.user) {
      setFilteredUserReservations(currentUserReservations);
      return;
    }

    applyReservationFilters(
      currentUserReservations,
      filterSelectedOptions,
      setFilteredUserReservations
    );
  }, [filterSelectedOptions, currentUserReservations]);

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-2 py-4 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista novih rezervacija
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

      {modalType === "add" && (
        <AppModal
          isOpen={true}
          title="Dodaj rezervaciju"
          formSchema={addFormSchema}
          onClose={handleModalClose}
          onSubmit={handleFormSubmit}
        />
      )}
      {filteredUserReservations && filteredUserReservations.length > 0 ? (
        <>
          <AppDataTable<INewReservation>
            tableName="newReservationsTable"
            columns={newReservationTableColumns}
            data={filteredUserReservations}
            addButtonName="Dodaj rezervaciju"
            onAddButtonClick={handleAddReservation}
            onApproveButtonClick={handleApproveReservation}
            onRejectButtonClick={handleRejectReservation}
            onCancelButtonClick={handleCancelReservation}
          />
          {modalType === "approve" && (
            <AppModal
              isOpen={true}
              title={`Odobri rezervaciju: ${purpose}`}
              formSchema={approveFormSchema}
              onClose={handleModalClose}
              onSubmit={handleApproveNewReservation}
              vehicleCategory={vehicleCategory}
              approvedReservations={approvedReservations}
            />
          )}
          {modalType === "cancel" && (
            <AppCancelModal
              isOpen={true}
              title={`Otkaži rezervaciju: ${purpose}`}
              onClose={handleModalClose}
              onSubmit={confirmCancelReservation}
            />
          )}
          {modalType === "reject" && (
            <AppModal
              isOpen={true}
              title={`Odbij rezervaciju: ${purpose}`}
              formSchema={rejectNewReservationTemplateSchema}
              onClose={handleModalClose}
              onSubmit={handleRejectNewReservation}
            />
          )}
        </>
      ) : (
        <div>
          <h1 className="text-2xl text-white font-semibold">
            Nema novih rezervacija
          </h1>
          {currentUser?.role === "zaposlenik" && (
            <div className="mt-4">
              <AddButton
                onClick={handleAddReservation}
                isDisabled={false}
                buttonText="Dodaj novu rezervaciju"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NewReservationList;
