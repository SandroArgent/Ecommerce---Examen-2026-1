/* 
Este archivo contendrá la lógica para gestionar los productos. Vamos a implementar las operaciones CRUD:
- getProducts: obtener productos.
- getProductById: obtener un producto específico.
- createProduct: crear un producto.
- updateProduct: actualizar un producto.
- deleteProduct: eliminar un producto.
*/


import { Product } from '../models/index.js';
import { Op } from 'sequelize';

// Validación reutilizable para crear y actualizar productos
const validateProductData = ({ name, price, stock, category }) => {
  if (typeof name !== 'string' || !name.trim()) {
    return 'El nombre es obligatorio';
  }

  if (
    price === undefined ||
    price === null ||
    price === '' ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    return 'El precio debe ser un número válido mayor o igual a 0';
  }

  if (
    stock === undefined ||
    stock === null ||
    stock === '' ||
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  ) {
    return 'El stock debe ser un entero mayor o igual a 0';
  }

  if (typeof category !== 'string' || !category.trim()) {
    return 'La categoría es obligatoria';
  }

  return null;
};

// GET: listar productos con paginación, filtros y ordenamiento
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);

    const { search, category, sortBy, order } = req.query;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        message: 'page debe ser un entero mayor o igual a 1'
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: 'limit debe ser un entero entre 1 y 100'
      });
    }

    if (sortBy && !['price', 'name'].includes(sortBy)) {
      return res.status(400).json({
        message: 'sortBy debe ser price o name'
      });
    }

    const sortOrder = (order ?? 'ASC').toUpperCase();

    if (!['ASC', 'DESC'].includes(sortOrder)) {
      return res.status(400).json({
        message: 'order debe ser ASC o DESC'
      });
    }

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`
      };
    }

    if (category) {
      where.category = category;
    }

    const result = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy || 'name', sortOrder]]
    });

    return res.status(200).json({
      success: true,
      totalProducts: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
      products: result.rows
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);

    return res.status(500).json({
      message: 'Error al obtener productos'
    });
  }
};

// POST: crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body ?? {};

    const validationError = validateProductData(req.body ?? {});

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      product
    });

  } catch (error) {
    console.error('Error al crear producto:', error);

    return res.status(500).json({
      message: 'Error al crear producto'
    });
  }
};

// PUT: actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body ?? {};

    const validationError = validateProductData(req.body ?? {});

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await product.update({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: category.trim()
    });

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado correctamente',
      product
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);

    return res.status(500).json({
      message: 'Error al actualizar producto'
    });
  }
};

// DELETE: eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);

    return res.status(500).json({
      message: 'Error al eliminar producto'
    });
  }
};


/* 
Diferencia entre findAndCountAll y FindAll:
Ambos son metodos de consulta ORMs.
findAll: ejecuta una sola consulta coincidente y devuelve un Array
findAndCountAll: ejecuta dos consultas, el objeto y su entero con el total y  el array con datos

Usa findAll() cuando no necesites paginación o el total de registros, o cuando la lista de resultados sea pequeña. 
Usa findAndCountAll() para interfaces de paginación (listados web/API) donde el usuario necesita saber cuántos registros existen en total

ejemplo:
findAll() → Te devuelve los 10 productos. Pero no te dice cuántos hay en total. Si querés saber "esto es la página 3 de 100", tenés que contarlos vos.
findAndCountAll() → Te devuelve los 10 productos y te dice "hay 1000 en total". Así podés calcular las páginas automáticamente.

    count: El número total de productos encontrados en la base de datos.
    rows: El array real con los productos.
____________________________________________________________________________________________________________________________________________________________________

SOBRE PAGINACION
Supongamos que tenemos 23 productos y queremos mostrar 5 por página.

Para conseguirlo, Sequelize utiliza dos opciones:
- limit: cantidad máxima de registros que queremos obtener.
- offset: cantidad de registros que queremos saltar.

RESUMEN O CONCLUSION
offset tiene un valor dinamica, salta de 5 en 5 por cada pagina (en este caso).  No necesariamente salta de 5 en 5; depende del limit y de la página. Se calcula con (page - 1) * limit
rows es lo que la cantidad que se muestra por pagina
count es los productos totales

Operacion aritmetica
Imagina que cada página muestra 5 productos:
    Si pides la Página 1: (1 - 1) * 5 = 0. Te saltas 0 productos. Empiezas a mostrar desde el producto 1 hasta el 5.
    Si pides la Página 2: (2 - 1) * 5 = 5. Te saltas los primeros 5 productos de la base de datos. Empiezas a mostrar desde el producto 6 hasta el 10.


otro ejemplo: 
GET /api/products?page=3&limit=5 (pagina 3 y 5 productos por pagina)
Tenemos 22 productos en total.
Offset: sería 10, no 5.
(3 - 1) \times 5 = 10\) Porque para llegar a la tercera página debemos saltarnos los primeros 10 productos.
*/