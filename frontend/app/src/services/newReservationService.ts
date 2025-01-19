import axios from "axios";
import { IApprovedReservationDTO, IRejectedReservationDto } from "../types";
import { getAxiosHeader } from "../components/configuration/axiosConfig";
import { handleFormError } from "../helpers/handleFormError";

const API_URL = "http://localhost:3000/reservations/new-created";

export const getNewReservations = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAxiosHeader(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createNewReservation = async (data: Record<string, any>) => {
  try {
    const response = await axios.post(API_URL, data);
    return response;
  } catch (error) {
    handleFormError(error);
  }
};

export const approveNewReservation = async (
  id: string,
  data: IApprovedReservationDTO
) => {
  try {
    const response = await axios.put(API_URL + `/${id}`, data);
    return response;
  } catch (error) {
    handleFormError(error);
  }
};

export const rejectNewReservation = async (
  id: string,
  data: IRejectedReservationDto
) => {
  try {
    const response = await axios.put(API_URL + `/${id}`, data);
    return response;
  } catch (error) {
    handleFormError(error);
  }
};

export const cancelNewReservation = async (reservationId: string) => {
  try {
    const response = await axios.delete(API_URL + `/${reservationId}`);
    return response;
  } catch (error) {
    handleFormError(error);
  }
};
