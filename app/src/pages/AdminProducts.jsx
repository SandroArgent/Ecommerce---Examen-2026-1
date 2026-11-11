import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductTable from '../components/ProductTable.jsx';
import ProductForm from '../components/ProductForm.jsx';
import Pagination from '../components/Pagination.jsx';

const emptyForm = { name: '', price: '', stock: '', category: '' };

// Panel de administración: agregar, editar y eliminar productos.
// Reutiliza los mismos filtros, tabla y paginación del catálogo.
export default function AdminProducts() {
  const { user } = useAuth();

  // Estados de la lista (mismo patrón que Products.jsx).
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0); // al cambiarlo se vuelve a consultar la API

  // Estados del formulario.
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null); // producto en edición o null
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  // Según el backend, solo el superadmin puede eliminar.
  const canDelete = user?.role === 'superadmin';

  useEffect(() => {
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
  }, [page, search, category, sortBy, order, reload]);

  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditing(null);
    setFormError('');
  };

  // Crear (POST) o actualizar (PUT) según haya un producto en edición.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setMessage('');
    setSaving(true);

    const data = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category
    };

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, data);
        setMessage('Producto actualizado correctamente.');
      } else {
        await api.post('/products', data);
        setMessage('Producto agregado correctamente.');
      }
      resetForm();
      setReload((current) => current + 1);
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'No se pudo guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  // Carga el producto en el formulario para modificarlo.
  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category
    });
    setFormError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;

    setMessage('');
    setError('');

    try {
      await api.delete(`/products/${product.id}`);
      setMessage('Producto eliminado correctamente.');
      if (editing?.id === product.id) resetForm();

      // Si se borró el único producto de la página, volvemos a la anterior.
      if (products.length === 1 && page > 1) setPage(page - 1);
      else setReload((current) => current + 1);
    } catch (requestError) {
      setMessage('');
      setError(requestError.response?.data?.message || 'No se pudo eliminar el producto.');
    }
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">PANEL DE ADMINISTRACIÓN</p>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p className="muted">Rol actual: {user?.role}</p>
      </section>

      <section className="catalog-panel">
        <ProductForm
          form={form}
          setForm={setForm}
          editing={editing}
          saving={saving}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </section>

      <section className="catalog-panel">
        <h2>Productos</h2>
        {message && <p role="status">{message}</p>}

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
        <ProductTable
          products={products}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={canDelete ? handleDelete : undefined}
        />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </section>
    </main>
  );
}
