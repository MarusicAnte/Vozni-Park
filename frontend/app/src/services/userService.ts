import axios from "axios";
import { getAxiosHeader } from "../components/configuration/axiosConfig";
import { handleFormError } from "../helpers/handleFormError";

const API_URL = "http://localhost:3000/users";

export const getUsers = async () => {
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

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(API_URL + `/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    handleFormError(error);
  }
};

export const createUser = async (data: Record<string, any>) => {
  try {
    const response = await axios.post(API_URL + "/registration", data);
    if (response.status === 201) {
      return response;
    }
  } catch (error) {
    handleFormError(error);
  }
};

export const updateUserById = async (data: Record<string, any>, id: string) => {
  try {
    const response = await axios.put(API_URL + `/${id}`, data);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleFormError(error);
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const response = await axios.delete(API_URL + `/${id}`);
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    handleFormError(error);
  }
};
