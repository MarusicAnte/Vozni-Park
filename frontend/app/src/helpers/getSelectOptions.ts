import { getUsers } from "../services/userService";
import { getVehicleCategory } from "../services/vehicleCategoryService";
import getVehicles from "../services/vehicleService";
import { ISelectOption, IUser, IVehicle, IVehicleCategory } from "../types";

export const getUserOptions = async (): Promise<Array<ISelectOption>> => {
  try {
    const response = await getUsers();
    const users: Array<ISelectOption> = response.map((item: IUser) => ({
      value: item._id,
      label: item.fullName,
    }));
    return users;
  } catch (error) {
    console.error("Error fetching user options:", error);
    return [];
  }
};

export const getVehicleCategoryOptions = async (): Promise<
  Array<ISelectOption>
> => {
  try {
    const response = await getVehicleCategory();
    const vehicleCategories: Array<ISelectOption> = response.map(
      (item: IVehicleCategory) => ({
        value: item._id,
        label: item.name,
      })
    );
    return vehicleCategories;
  } catch (error) {
    console.error("Error fetching vehicle categories:", error);
    return [];
  }
};

export const getVehicleOptions = async (
  category?: string
): Promise<Array<ISelectOption>> => {
  try {
    const response = await getVehicles(category);
    const vehicles: Array<ISelectOption> = response.availableVehicles.map(
      (item: IVehicle) => ({
        value: item._id,
        label: item.model,
        category: item.category._id,
      })
    );
    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

export const getAvailabilityOptions = async () => {
  return [
    {
      value: "all",
      label: "Sve",
    },
    {
      value: "true",
      label: "Dostupno",
    },
    {
      value: "false",
      label: "Nedostupno",
    },
  ];
};
