import axios from "axios";
import { getAxiosHeader } from "../components/configuration/axiosConfig";
import { handleFormError } from "../helpers/handleFormError";
import { IVehicleMalfunctionCreateDto } from "../types";

const API_URL = "http://localhost:3000/vehicle-malfunction";

export const getVehicleMalfunctions = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAxiosHeader(),
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createVehicleMalfunction = async (
  vehicleId: string,
  data: IVehicleMalfunctionCreateDto
) => {
  try {
    const response = await axios.post(API_URL + `/${vehicleId}`, data);
    return response;
  } catch (error) {
    handleFormError(error);
  }
};

export const fixVehicleMailfunction = async (id: string) => {
  try {
    const response = await axios.delete(API_URL + `/${id}`, {
      headers: getAxiosHeader(),
    });
    return response;
  } catch (error) {
    handleFormError(error);
  }
};
