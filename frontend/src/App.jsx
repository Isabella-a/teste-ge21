import { useEffect, useState } from "react";
import UserForm from "./components/UserForm";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatPhone = (phone) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

const formatCPF = (cpf) => {
  if (!cpf) return "";
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
};

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users/`);
        if (!response.ok) {
          throw new Error("Erro ao buscar usuários");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchUsers();
  }, [API_URL]);

  const handleUserCreated = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.cpf === updatedUser.cpf ? updatedUser : user
      )
    );
    setEditingUser(null);
  };

  const handleDeleteUser = async (cpf) => {
    try {
      const response = await fetch(`${API_URL}/users/${cpf}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.cpf !== cpf));
      } else {
        console.error("Erro ao deletar usuário");
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor", error);
    }
  };

  return (
    <div className="container">
      <header className="header">Gerenciamento de Usuários</header>

      <UserForm
        onUserCreated={handleUserCreated}
        userToEdit={editingUser}
        onUserUpdated={handleUserUpdated}
        cancelEdit={() => setEditingUser(null)}
      />

      <h2>Lista de Usuários</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Nascimento</th>
            <th>Telefone</th>
            <th>Horas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.cpf}>
              <td>{user.name}</td>
              <td>{formatCPF(user.cpf)}</td>
              <td>{user.email}</td>
              <td>{formatDate(user.birth_date)}</td>
              <td>{formatPhone(user.phone)}</td>
              <td>{user.workload}</td>
              <td className="actions-btns">
                <button className="edit-button" onClick={() => setEditingUser(user)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDeleteUser(user.cpf)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
