import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const UserForm = ({ onUserCreated, userToEdit, onUserUpdated, cancelEdit }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    cpf: "",
    name: "",
    email: "",
    birth_date: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    phone: "",
    workload: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (userToEdit) {
      setFormData(userToEdit);
      setSelectedState(userToEdit.state);
    } else {
      setFormData({
        cpf: "",
        name: "",
        email: "",
        birth_date: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        phone: "",
        workload: 0,
      });
      setSelectedState("");
      setCities([]);
    }
  }, [userToEdit]);

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setFormData((prev) => ({ ...prev, state: state, city: "" }));
    if (state) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/ibge/municipios/v1/${state}`
        );
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        setCities([]);
      }
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData((prev) => ({ ...prev, city: city }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      const numericValue = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Email inválido");
      } else {
        setEmailError("");
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (emailError) {
      setErrorMessage("Por favor, corrija os erros antes de enviar.");
      return;
    }

    const payload = { ...formData }; // CPF é enviado como números

    try {
      let response, data;
      if (userToEdit) {
        // Se estiver editando, envia PUT para atualizar o usuário
        response = await fetch(`${API_URL}/users/${formData.cpf}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Se estiver criando, envia POST para criar o usuário
        response = await fetch(`${API_URL}/users/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      data = await response.json();
      console.log("Resposta:", data);
      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const cpfError = data.detail.find(
            (err) => err.msg && err.msg.toLowerCase().includes("cpf")
          );
          if (cpfError) {
            setErrorMessage("Usuário com esse CPF já está cadastrado.");
          } else {
            setErrorMessage("Erro ao salvar usuário.");
          }
        } else if (data.detail && typeof data.detail === "string") {
          if (data.detail.toLowerCase().includes("cpf")) {
            setErrorMessage("Usuário com esse CPF já está cadastrado.");
          } else {
            setErrorMessage("Erro ao salvar usuário.");
          }
        } else {
          setErrorMessage("Erro ao salvar usuário.");
        }
        return;
      }
      if (userToEdit) {
        onUserUpdated(data);
      } else {
        onUserCreated(data);
      }
      // Limpa o formulário e encerra o modo edição, se houver
      setFormData({
        cpf: "",
        name: "",
        email: "",
        birth_date: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        phone: "",
        workload: 0,
      });
      setSelectedState("");
      setCities([]);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro na conexão com o servidor.");
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label htmlFor="name">Nome:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <label htmlFor="email">E-mail:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      {emailError && <p className="error-message">{emailError}</p>}

      <div className="form-row">
        <div>
          <label htmlFor="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="Somente números"
            maxLength="11"
            disabled={userToEdit ? true : false}
          />
        </div>
        <div>
          <label htmlFor="birth_date">Data de Nascimento:</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <label htmlFor="street">Rua:</label>
      <input
        type="text"
        id="street"
        name="street"
        value={formData.street}
        onChange={handleChange}
      />

      <div className="form-row">
        <div>
          <label htmlFor="number">Número:</label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="neighborhood">Bairro:</label>
          <input
            type="text"
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="stateSelect">Estado:</label>
          <select
            id="stateSelect"
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="">Selecione um estado</option>
            {[
              "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
              "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
              "RR", "SC", "SP", "SE", "TO"
            ].map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="citySelect">Cidade:</label>
          <select
            id="citySelect"
            onChange={handleCityChange}
            value={formData.city}
          >
            <option value="">Selecione uma cidade</option>
            {cities.map((city, index) => (
              <option key={index} value={city.nome}>
                {city.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="phone">Telefone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="workload">Carga Horária:</label>
          <input
            type="number"
            id="workload"
            name="workload"
            value={formData.workload}
            onChange={handleChange}
          />
        </div>
      </div>

      {!userToEdit && 
        <button type="submit">
          Cadastrar Usuário
        </button>
      }
      {userToEdit && (
        <div className="btn-edit">
          <button type="submit">
            Atualizar Usuário
          </button>
          <button type="button" className="cancel-btn" onClick={cancelEdit}>
            Cancelar Edição
          </button>
        </div>
      )}
    </form>
  );
};

UserForm.propTypes = {
  onUserCreated: PropTypes.func.isRequired,
  userToEdit: PropTypes.object,
  onUserUpdated: PropTypes.func,
  cancelEdit: PropTypes.func,
};

export default UserForm;
