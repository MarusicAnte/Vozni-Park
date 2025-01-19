import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { useState } from "react";

interface INavBarLink {
  key: string;
  to: string;
  name: string;
}

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navBarLinks: Array<INavBarLink> = [
    {
      key: "vehicles",
      to: "/home/vehicles",
      name: "Vozila",
    },
    {
      key: "users",
      to: "/home/users",
      name: "Korisnici",
    },
    {
      key: "newCreatedReservations",
      to: "/home/reservations/new-created",
      name: "Nove rezervacije",
    },
    {
      key: "approvedReservations",
      to: "/home/reservations/approved",
      name: "Odobrene Rezervacije",
    },
    {
      key: "rejectedReservations",
      to: "/home/reservations/rejected",
      name: "Odbijene Rezervacije",
    },
    {
      key: "finishedReservations",
      to: "/home/reservations/finished",
      name: "Istekle Rezervacije",
    },
    {
      key: "vehicleMalfunctions",
      to: "/home/vehicleMalfunctions",
      name: "Kvarovi vozila",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-cyan-600 py-2 px-4 rounded-md flex justify-between items-center tablet:items-start laptop:items-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 laptop:flex-row">
          <div className="flex flex-col items-center tablet:flex-row">
            <img
              src={currentUser?.imageURL}
              alt="user-profile"
              className="w-16 h-16 rounded-full tablet:mr-2 border-4 border-[rgb(127,187,218)]"
            />
            <span className="text-lg font-semibold text-white">
              {currentUser?.fullName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-cyan-50 h-fit text-black rounded-sm font-semibold px-2 py-1"
          >
            Odjavi se
          </button>
        </div>
      </div>

      <div className="tablet:flex tablet:flex-col tablet:items-end tablet:absolute tablet:right-12">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block laptop:hidden text-white bg-cyan-800 px-2 py-1 rounded-md ml-2"
        >
          ☰
        </button>
        <div
          className={`flex flex-col gap-2 mt-2  laptop:flex-row laptop:items-center ${
            isMenuOpen
              ? "block tablet:bg-[rgb(135,192,220)] tablet:opacity-100 tablet:z-10 tablet:p-2 tablet:rounded-xl"
              : "hidden laptop:flex"
          }`}
        >
          {navBarLinks.map((link) => (
            <NavLink
              key={link.key}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "p-2 bg-cyan-900 text-white rounded-md font-semibold min-h-[48px] flex items-center justify-center"
                  : "p-2 bg-cyan-50 text-black rounded-md font-semibold min-h-[48px] flex items-center justify-center"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
