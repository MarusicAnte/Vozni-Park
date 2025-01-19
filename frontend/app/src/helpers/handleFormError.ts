export const handleFormError = (error: any) => {
  if (error.response) {
    alert(error.response.data.error);
  } else if (error.request) {
    alert("No response received from the server.");
  } else {
    alert(`Error in request setup: ${error.error}`);
  }
};
