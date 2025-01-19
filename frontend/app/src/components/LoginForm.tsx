import LoginFormInput from "./inputs/LoginFormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

interface ILogin {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required("Required"),
  password: Yup.string().required("Required"),
});

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const initialValues: ILogin = {
    email: "",
    password: "",
  };

  const onSubmit = async (values: ILogin) => {
    try {
      await login(values);
      navigate("/home/vehicles");
    } catch (error) {
      console.error("Login failed: ", error);
      alert("Prijava nije uspjela. Pokušajte ponovo.");
    }
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col w-1/2 self-center py-4"
    >
      <h1 className="text-xl font-semibold mb-6">Prijava korisnika</h1>
      <LoginFormInput
        label="Email"
        type="email"
        name="email"
        placeholder="Email..."
        onChange={formik.handleChange}
        value={formik.values.email}
        onBlur={formik.handleBlur}
        touched={formik.touched.email}
        errorMessage={formik.errors.email}
      />
      <LoginFormInput
        label="Password"
        type="password"
        name="password"
        placeholder="Password..."
        onChange={formik.handleChange}
        value={formik.values.password}
        onBlur={formik.handleBlur}
        touched={formik.touched.password}
        errorMessage={formik.errors.password}
      />
      <button
        type="submit"
        className="bg-cyan-700 text-white w-fit px-4 py-2 font-semibold self-center cursor-pointer rounded-md"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Prijava
      </button>
    </form>
  );
}

export default LoginForm;
