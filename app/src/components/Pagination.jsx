// Solo controla la navegación visual; Products.jsx cambia el estado y vuelve a consultar.
function Pagination({ page, totalPages, setPage }) {
  return (
    <nav className="pagination" aria-label="Paginación del catálogo">
      <button className="button button-secondary" disabled={page <= 1}
        onClick={() => setPage((current) => Math.max(1, current - 1))}>
        Anterior
      </button>

      <span>Página <strong>{page}</strong> de <strong>{totalPages}</strong></span>

      <button className="button button-secondary" disabled={page >= totalPages}
        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
        Siguiente
      </button>
    </nav>
  );
}

export default Pagination;
