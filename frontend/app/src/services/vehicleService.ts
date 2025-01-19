import axios from "axios";
import { getAxiosHeader } from "../components/configuration/axiosConfig";

const API_URL = "http://localhost:3000/vehicle";

const getVehicles = async (category?: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAxiosHeader(),
      params: category ? { category } : {},
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getVehicles;
