import { IFilterSelectedOptions, IVehicle } from "../types";

export const applyReservationFilters = <T extends { [key: string]: any }>(
  currentUserReservations: Array<T>,
  filterSelectedOptions: IFilterSelectedOptions,
  setFilteredReservations: React.Dispatch<React.SetStateAction<Array<T>>>
) => {
  let filteredData = [...currentUserReservations];

  if (filterSelectedOptions.vehicleCategory?.value) {
    filteredData = filteredData.filter(
      (reservation) =>
        reservation.vehicleCategory?._id ===
        filterSelectedOptions.vehicleCategory?.value
    );
  }

  if (filterSelectedOptions.vehicle?.value) {
    filteredData = filteredData.filter(
      (reservation) =>
        reservation.vehicle?._id === filterSelectedOptions.vehicle?.value
    );
  }

  if (filterSelectedOptions.user?.value) {
    filteredData = filteredData.filter(
      (reservation) =>
        reservation.user?._id === filterSelectedOptions.user?.value
    );
  }

  setFilteredReservations(filteredData);
};

export const applyVehicleFilter = (
  vehicles: Array<IVehicle>,
  filterSelectedOptions: IFilterSelectedOptions,
  setFilteredVehicles: React.Dispatch<React.SetStateAction<Array<IVehicle>>>
) => {
  let filteredData = vehicles;

  if (filterSelectedOptions.vehicleCategory?.value) {
    filteredData = filteredData.filter(
      (vehicle) =>
        vehicle.category._id === filterSelectedOptions.vehicleCategory?.value
    );
  }

  if (
    filterSelectedOptions.availability?.value !== "all" &&
    filterSelectedOptions.availability?.value !== undefined
  ) {
    filteredData = filteredData.filter(
      (vehicle) =>
        vehicle.isAvaiable ===
        (filterSelectedOptions.availability?.value === "true")
    );
  }

  setFilteredVehicles(filteredData);
};
