import { useEffect, useState } from 'react';
import api from '../services/api.js';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductTable from '../components/ProductTable.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Evita que una respuesta vieja sobrescriba los resultados de filtros más nuevos.
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/products', {
          params: { page, limit: 5, search, category, sortBy, order },
          signal: controller.signal
        });

        setProducts(response.data.products ?? []);
        setTotalPages(Math.max(1, response.data.totalPages ?? 1));
      } catch (requestError) {
        if (requestError.code === 'ERR_CANCELED') return;
        console.error('Error al obtener productos:', requestError);
        setProducts([]);
        setTotalPages(1);
        setError(requestError.response?.data?.message || 'No se pudieron cargar los productos.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [page, search, category, sortBy, order]);

  // Al cambiar un filtro volvemos a la primera página para no pedir una página inexistente.
  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">EXPLORÁ EL CATÁLOGO</p>
        <h1>Instrumentos y accesorios</h1>
        <p className="muted">Buscá productos, filtrá por categoría y ordená los resultados.</p>
      </section>

      <section className="catalog-panel">
        <ProductFilters
          search={search}
          setSearch={updateFilter(setSearch)}
          category={category}
          setCategory={updateFilter(setCategory)}
          sortBy={sortBy}
          setSortBy={updateFilter(setSortBy)}
          order={order}
          setOrder={updateFilter(setOrder)}
        />
        <ProductTable products={products} loading={loading} error={error} />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </section>
    </main>
  );
}
