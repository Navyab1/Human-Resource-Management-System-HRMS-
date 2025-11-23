import React, { useState, useEffect } from "react";

export default function TeamForm({ onSubmit, initialValues, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        description: initialValues.description || ""
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
      <h3 style={{ marginTop: 0 }}>{initialValues ? "Edit Team" : "Create Team"}</h3>
      <div className="form-row">
        <label>Name</label>
        <br />
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-row">
        <label>Description</label>
        <br />
        <input name="description" value={form.description} onChange={handleChange} />
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
