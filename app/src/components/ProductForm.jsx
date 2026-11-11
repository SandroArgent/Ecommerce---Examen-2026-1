// Componente presentacional: formulario para crear o editar un producto.
// No consulta la API; AdminProducts.jsx recibe los datos mediante onSubmit.
function ProductForm({ form, setForm, editing, saving, error, onSubmit, onCancel }) {
  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  return (
    <form className="product-form" onSubmit={onSubmit}>
      <h2>{editing ? `Editar producto #${editing.id}` : 'Agregar producto'}</h2>

      <div className="filters">
        <label className="filter-field">
          Nombre
          <input value={form.name} onChange={updateField('name')} required />
        </label>

        <label className="filter-field">
          Precio
          <input type="number" min="0" step="0.01" value={form.price} onChange={updateField('price')} required />
        </label>

        <label className="filter-field">
          Stock
          <input type="number" min="0" step="1" value={form.stock} onChange={updateField('stock')} required />
        </label>

        <label className="filter-field">
          Categoría
          <select value={form.category} onChange={updateField('category')} required>
            <option value="">Seleccionar</option>
            <option value="cuerdas">Cuerdas</option>
            <option value="viento">Viento</option>
            <option value="percusion">Percusión</option>
            <option value="teclados">Teclados</option>
          </select>
        </label>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="button button-primary" disabled={saving}>
          {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar'}
        </button>
        {editing && (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
