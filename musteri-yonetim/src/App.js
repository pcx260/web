import React, { useState, useEffect } from "react";
import "./App.css"; // Stil varsa burada

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ id: null, name: "", email: "", phone: "", company: "" });
  const [editing, setEditing] = useState(false);

  // İlk açıldığında localStorage'dan verileri yükle
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customers")) || [];
    setCustomers(saved);
  }, []);

  // Her değişiklikte localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("İsim ve e-posta zorunlu!");

    if (editing) {
      setCustomers(
        customers.map((c) => (c.id === form.id ? form : c))
      );
      setEditing(false);
    } else {
      const newCustomer = { ...form, id: crypto.randomUUID() };
      setCustomers([...customers, newCustomer]);
    }

    setForm({ id: null, name: "", email: "", phone: "", company: "" });
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Silmek istediğine emin misin?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <h1>Müşteri Yönetim Sistemi</h1>

      {/* Arama */}
      <input
        type="text"
        placeholder="Ara (isim veya e-posta)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", margin: "10px 0", padding: "8px" }}
      />

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="name" value={form.name} onChange={handleInputChange} placeholder="İsim" required />
        <input name="email" value={form.email} onChange={handleInputChange} placeholder="E-posta" required />
        <input name="phone" value={form.phone} onChange={handleInputChange} placeholder="Telefon" />
        <input name="company" value={form.company} onChange={handleInputChange} placeholder="Şirket" />
        <button type="submit">{editing ? "Güncelle" : "Ekle"}</button>
      </form>

      {/* Liste */}
      <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>İsim</th>
            <th>E-posta</th>
            <th>Telefon</th>
            <th>Şirket</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr><td colSpan="5">Kayıt bulunamadı.</td></tr>
          ) : (
            filteredCustomers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.company}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Düzenle</button>{" "}
                  <button onClick={() => handleDelete(c.id)}>Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
