import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Upload, X, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "../utils/adminApi";

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  form,
  onChange,
  saving,
  editingProduct,
  files,
  setFiles,
  onRefresh,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedOldImages, setSelectedOldImages] = useState([]);
  const [deletingImages, setDeletingImages] = useState(false);

  const previewUrls = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (!open) {
      setSelectedOldImages([]);
    }
  }, [open]);

  if (!open) return null;

  const addFiles = (incomingFiles) => {
    const selected = Array.from(incomingFiles || []);
    if (!selected.length) return;

    const imageFiles = selected.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (imageFiles.length !== selected.length) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
    }

    const combined = [...files, ...imageFiles];

    if (combined.length > 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }

    setFiles(combined);
  };

  const handleFileInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const removeNewFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const toggleOldImageSelection = (img) => {
    setSelectedOldImages((prev) =>
      prev.includes(img) ? prev.filter((item) => item !== img) : [...prev, img]
    );
  };

  const deleteSelectedOldImages = async () => {
    if (!editingProduct?._id || selectedOldImages.length === 0) {
      toast.error("Please select image(s) to delete");
      return;
    }

    try {
      setDeletingImages(true);

      await apiRequest(`/product/delete-selected-images/${editingProduct._id}`, {
        method: "POST",
        body: JSON.stringify({ images: selectedOldImages }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Selected image(s) deleted successfully");
      setSelectedOldImages([]);
      onRefresh?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete selected images");
    } finally {
      setDeletingImages(false);
    }
  };

  const showExistingImages = editingProduct?.images?.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
      <div className="mx-auto mt-10 w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Product title"
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onChange}
                placeholder="Product price"
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="Category"
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Stock</label>
              <select
                name="stock"
                value={form.stock}
                onChange={onChange}
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none"
              >
                <option value="" disabled>
                  Select stock status
                </option>
                <option value="in stock">In Stock</option>
                <option value="stock out">Out Of Stock</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              placeholder="Product description"
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {showExistingImages && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  Current images ({editingProduct.images.length})
                </p>

                <button
                  type="button"
                  onClick={deleteSelectedOldImages}
                  disabled={deletingImages || selectedOldImages.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingImages
                    ? "Deleting..."
                    : `Delete Selected (${selectedOldImages.length})`}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {editingProduct.images.map((img, index) => {
                  const selected = selectedOldImages.includes(img);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleOldImageSelection(img)}
                      className={`group relative overflow-hidden rounded-2xl border transition ${
                        selected
                          ? "border-red-500 ring-2 ring-red-500/40"
                          : "border-slate-800"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`product-${index}`}
                        className="h-32 w-full object-cover"
                      />

                      <div
                        className={`absolute inset-0 transition ${
                          selected ? "bg-red-900/30" : "bg-black/0 group-hover:bg-black/20"
                        }`}
                      />

                      <div
                        className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full ${
                          selected
                            ? "bg-red-600 text-white"
                            : "bg-black/60 text-slate-300"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Click one or multiple images to select them for deletion.
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Upload New Images
            </label>

            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition ${
                dragActive
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-slate-700 bg-slate-900 hover:border-violet-500/70"
              }`}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
                <Upload className="h-6 w-6" />
              </div>

              <p className="text-white">
                Drag & drop images here, or click to browse
              </p>
              <p className="mt-2 text-sm text-slate-400">
                JPG, PNG, WEBP • Max 6 images
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={handleFileInputChange}
              />
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                <ImagePlus className="h-4 w-4" />
                New image preview ({files.length}/6)
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {previewUrls.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                  >
                    <img
                      src={item.url}
                      alt={item.file.name}
                      className="h-32 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="truncate px-2 py-2 text-xs text-slate-300">
                      {item.file.name}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-xs text-amber-400">
                Uploading new images will be handled when you submit the form.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-slate-700 px-4 py-3 text-slate-200 transition hover:bg-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
              {saving
                ? editingProduct
                  ? "Updating..."
                  : "Creating..."
                : editingProduct
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}