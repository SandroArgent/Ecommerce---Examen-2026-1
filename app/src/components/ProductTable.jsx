// Componente presentacional: recibe productos y estados de la consulta.
// Si recibe onEdit / onDelete (panel de administración) agrega una columna de acciones.
// En el catálogo público no se pasan, así que se ve exactamente igual que antes.
function ProductTable({ products, loading, error, onEdit, onDelete }) {
  if (loading) return <p className="table-message">Cargando productos...</p>;
  if (error) return <p className="table-message form-error" role="alert">{error}</p>;
  if (!products.length) return <p className="table-message">No se encontraron productos.</p>;

  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="table-wrapper">
      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            {showActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td data-label="Producto">{product.name}</td>
              <td data-label="Precio">${Number(product.price).toLocaleString('es-AR')}</td>
              <td data-label="Stock">{product.stock}</td>
              <td data-label="Categoría">{product.category}</td>
              {showActions && (
                <td data-label="Acciones">
                  <div className="table-actions">
                    {onEdit && (
                      <button className="button button-secondary" type="button" onClick={() => onEdit(product)}>
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button className="button button-secondary" type="button" onClick={() => onDelete(product)}>
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
