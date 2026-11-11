// Componente presentacional: recibe los valores y setters desde Products.jsx.
// No consulta la API ni mantiene estados propios.
function ProductFilters({
  search, setSearch,
  category, setCategory,
  sortBy, setSortBy,
  order, setOrder
}) {
  return (
    <section className="filters" aria-label="Filtros de productos">
      <label className="filter-field filter-search">
        Buscar
        <input
          type="search"
          value={search}
          placeholder="Ej.: guitarra"
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      <label className="filter-field">
        Categoría
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Todas</option>
          <option value="cuerdas">Cuerdas</option>
          <option value="viento">Viento</option>
          <option value="percusion">Percusión</option>
          <option value="teclados">Teclados</option>
        </select>
      </label>

      <label className="filter-field">
        Ordenar por
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
        </select>
      </label>

      <label className="filter-field">
        Dirección
        <select value={order} onChange={(event) => setOrder(event.target.value)}>
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
        </select>
      </label>
    </section>
  );
}

export default ProductFilters;
