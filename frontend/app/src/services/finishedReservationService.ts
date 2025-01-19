import axios from "axios";
import { getAxiosHeader } from "../components/configuration/axiosConfig";
import { handleFormError } from "../helpers/handleFormError";

const API_URL = "http://localhost:3000/reservations/finished";

export const getFinishedReservations = async () => {
  try {
    const respose = await axios.get(API_URL, {
      headers: getAxiosHeader(),
    });
    return respose.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteFinishedReservationById = async (reservationId: string) => {
  try {
    const response = await axios.delete(API_URL + `/${reservationId}`);
    return response;
  } catch (error) {
    handleFormError(error);
  }
};
