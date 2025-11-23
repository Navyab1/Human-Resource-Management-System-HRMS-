import React, { useState, useEffect } from "react";

export default function EmployeeForm({ onSubmit, initialValues, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: ""
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        email: initialValues.email || "",
        position: initialValues.position || ""
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }} className="card">
      <h3 style={{ marginTop: 0 }}>{initialValues ? "Edit Employee" : "Create Employee"}</h3>
      <div className="form-row">
        <label>Name</label>
        <br />
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>Email</label>
        <br />
        <input name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>Position</label>
        <br />
        <input name="position" value={form.position} onChange={handleChange} />
      </div>
      <button type="submit" className="btn" style={{ marginRight: "0.4rem" }}>
        Save
      </button>
      {onCancel && (
        <button onClick={onCancel} type="button" className="btn-secondary">
          Cancel
        </button>
      )}
    </form>
  );
}
