import { useLoaderData, useNavigate } from "react-router-dom";
import AppDataTable from "../components/table/AppDataTable";
import { useState } from "react";
import { IFormField, ITableColumn, IUser } from "../types";
import AppModal from "../components/modals/AppModal";
import AppDeleteModal from "../components/modals/AppDeleteModal";
import {
  createUser,
  deleteUserById,
  updateUserById,
} from "../services/userService";

const userTableColumns: Array<ITableColumn> = [
  {
    key: "imageURL",
    name: "Slika",
  },
  {
    key: "fullName",
    name: "Ime i prezime",
  },
  {
    key: "username",
    name: "Username",
  },
  {
    key: "email",
    name: "Email",
  },
  {
    key: "role",
    name: "Uloga",
  },
  {
    key: "manageOptions",
    name: "Opcije",
  },
];

const userFormSchemaTemplate: Array<IFormField> = [
  {
    label: "Ime i prezime",
    name: "fullName",
    type: "input",
    placeholder: "Unesite ime i prezime",
    value: "",
    onChange: () => {},
  },
  {
    label: "Slika URL",
    name: "imageURL",
    type: "input",
    placeholder: "https://xsgames.co/randomusers/assets/avatars/male/60.jpg",
    value: "",
    onChange: () => {},
  },
  {
    label: "Username",
    name: "username",
    type: "input",
    placeholder: "Unesite username",
    value: "",
    onChange: () => {},
  },
  {
    label: "Email",
    name: "email",
    type: "input",
    placeholder: "Unesite email",
    value: "",
    onChange: () => {},
  },
  {
    label: "Password",
    name: "password",
    type: "input",
    placeholder: "Unesite password",
    value: "",
    onChange: () => {},
  },
  {
    label: "Uloga",
    name: "role",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "zaposlenik", label: "Zaposlenik" },
    ],
    value: "",
    onChange: () => {},
  },
];

function UserList() {
  const users = useLoaderData();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [formSchema, setFormSchema] = useState(userFormSchemaTemplate);

  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const handleDeleteUser = (user: IUser) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      const response = await deleteUserById(userToDelete._id);
      if (response?.status === 200) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setUserToDelete(null);
        setDeleteModalOpen(false);
      }
    }
  };

  const handleAddUser = () => {
    setFormSchema(userFormSchemaTemplate);
    setIsUpdating(false);
    setCurrentUser(null);
    setModalOpen(true);
  };

  const handleUpdateUser = (user: IUser) => {
    setCurrentUser(user);
    setIsUpdating(true);

    const updatedSchema = userFormSchemaTemplate.map((field) => ({
      ...field,
      value: user[field.name as keyof IUser] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
        setFormSchema((prevSchema) =>
          prevSchema.map((f) =>
            f.name === field.name ? { ...f, value: e.target.value } : f
          )
        );
      },
    }));

    setFormSchema(updatedSchema);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (isUpdating && currentUser) {
      const userId = currentUser._id;
      const response = await updateUserById(data, userId);
      if (response?.status === 200) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setModalOpen(false);
      }
    } else {
      const response = await createUser(data);
      if (response?.status === 201) {
        alert(response.data.message);
        navigate(".", { replace: true });
        setModalOpen(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-cyan-600 px-2 py-4 rounded-md">
      <h1 className="text-white text-3xl font-bold self-start py-4 px-2">
        Lista korisnika
      </h1>
      <AppModal
        isOpen={isModalOpen}
        title={isUpdating ? "Ažuriraj korisnika" : "Dodaj korisnika"}
        formSchema={formSchema}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
      />
      {users ? (
        <>
          <AppDataTable<IUser>
            tableName="usersTable"
            columns={userTableColumns}
            data={users}
            addButtonName="Dodaj zaposlenika"
            onAddButtonClick={handleAddUser}
            onUpdateButtonClick={handleUpdateUser}
            onDeleteButtonClick={handleDeleteUser}
          />
          <AppDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={confirmDeleteUser}
            title="Izbriši korisnika"
            message={`Želite li izbrisati korisnika: ${userToDelete?.fullName}?`}
          />
        </>
      ) : (
        <h1 className="text-2xl text-white font-semibold">Nema korisnika</h1>
      )}
    </div>
  );
}

export default UserList;
