import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest, money } from "../utils/adminApi";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const emptyProduct = {
  title: "",
  price: "",
  category: "",
  stock: "",
  description: "",
};

const capitalizeWords = (text) => {
  if (!text) return "-";
  return text
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/product/all-products");
      setProducts(data.products || data.data || []);
    } catch (error) {
      if (error.message !== "Unauthorized") {
        toast.error(error.message || "Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      [p.title, p.category, p.description, p.stock]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [products, query]);

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyProduct);
    setFiles([]);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyProduct);
    setFiles([]);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
      description: product.description || "",
    });
    setFiles([]);
    setModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("title", form.title.trim().toLowerCase());
      fd.append("price", String(form.price));
      fd.append("category", form.category.trim().toLowerCase());
      fd.append("stock", form.stock.trim().toLowerCase());
      fd.append("description", form.description.trim());

      files.forEach((file) => {
        fd.append("images", file);
      });

      if (editingProduct?._id) {
        await apiRequest(`/product/update/${editingProduct._id}`, {
          method: "PUT",
          body: fd,
        });
        toast.success("Product updated successfully");
      } else {
        await apiRequest("/product/create", {
          method: "POST",
          body: fd,
        });
        toast.success("Product created successfully");
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      if (error.message !== "Unauthorized") {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct?._id) return;

    try {
      setDeleting(true);

      await apiRequest(`/product/delete/${deletingProduct._id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p._id !== deletingProduct._id));
      toast.success("Product deleted successfully");
      closeDeleteModal();
    } catch (error) {
      if (error.message !== "Unauthorized") {
        toast.error(error.message || "Failed to delete product");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white">Products</h1>

        <div className="flex gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3 pl-9 pr-3 text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            onClick={openCreate}
            className="rounded-2xl bg-violet-600 px-4 py-3 text-white transition hover:bg-violet-500"
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-slate-900/80">
                  <td className="px-4 py-4 text-white">
                    {capitalizeWords(product.title)}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {capitalizeWords(product.category)}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {money(product.price)}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {capitalizeWords(product.stock)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="rounded-xl bg-amber-600 px-3 py-2 text-white transition hover:bg-amber-500"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </span>
                      </button>

                      <button
                        onClick={() => openDeleteModal(product)}
                        className="rounded-xl bg-red-600 px-3 py-2 text-white transition hover:bg-red-500"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={submitProduct}
        form={form}
        onChange={handleChange}
        saving={saving}
        editingProduct={editingProduct}
        files={files}
        setFiles={setFiles}
        onRefresh={fetchProducts}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteProduct}
        loading={deleting}
        title="Delete product"
        message={`Are you sure you want to delete "${deletingProduct?.title || "this product"
          }"? This action cannot be undone.`}
      />
    </div>
  );
}