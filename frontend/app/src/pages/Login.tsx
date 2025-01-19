import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div className="w-full flex items-start p-[5%] ">
      <div className="w-1/2 h-full flex flex-col border-y-2 border-l-2 border-[black]">
        <img
          src="../../public/images/login-image.webp"
          alt="login-image"
          className="h-full"
        />
      </div>
      <div className="w-1/2 h-full flex flex-col items-start justify-center border-y-2 border border-[black] pl-4 bg-white">
        <h1 className="self-center text-3xl font-semibold mb-6 mt-2">
          Dobrodošli u vozni park !
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
