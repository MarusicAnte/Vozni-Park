import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4">
      404 Not Found
      <Link to="/home" className="bg-cyan-500 p-1 w-fit cursor-pointer">
        Home
      </Link>
    </div>
  );
}

export default NotFound;
