import axios from "axios";
import { getAxiosHeader } from "../components/configuration/axiosConfig";

const API_URL = "http://localhost:3000/reservations/approved";

export const getApprovedReservationsForVehicleById = async (
  vehicleId: string
) => {
  try {
    const response = await axios.get(API_URL + `/${vehicleId}`, {
      headers: getAxiosHeader(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getApprovedReservations = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAxiosHeader(),
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
