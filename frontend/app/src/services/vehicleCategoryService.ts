import axios from "axios";

const API_URL = "http://localhost:3000/vehicle-category";

export const getVehicleCategory = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
