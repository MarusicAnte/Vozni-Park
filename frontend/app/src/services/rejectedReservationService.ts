import axios from "axios";
import { getAxiosHeader } from "../components/configuration/axiosConfig";

const API_URL = "http://localhost:3000/reservations/rejected";

export const getRejectedReservations = async () => {
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
