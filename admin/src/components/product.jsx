import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../api/api";

const MAX_IMAGES = 6;

export default function AdminCreateProduct() {
    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        category: "",
        stock: "",
    });

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const previews = useMemo(
        () =>
            files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
                name: file.name,
            })),
        [files]
    );

    // cleanup object URLs
    useEffect(() => {
        return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
    }, [previews]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const onPickFiles = (e) => {
        const selected = Array.from(e.target.files || []);
        if (!selected.length) return;

        const next = [...files, ...selected];

        if (next.length > MAX_IMAGES) {
            toast.error(`Max ${MAX_IMAGES} images allowed`);
        }

        setFiles(next.slice(0, MAX_IMAGES));
        e.target.value = "";
    };

    const removeFileAt = (idx) => setFiles((arr) => arr.filter((_, i) => i !== idx));

    const validate = () => {
        if (!form.title.trim()) return "Title is required";
        if (form.price === "" || form.price === null) return "Price is required";
        if (Number.isNaN(Number(form.price))) return "Price must be a number";
        if (!form.stock || form.stock === "not selected") return "Please select stock status";
        if (files.length === 0) return "Please select at least 1 product image";
        return null;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const err = validate();
        if (err) return toast.error(err);

        try {
            setLoading(true);

            const fd = new FormData();
            fd.append("title", form.title.trim());
            fd.append("price", String(form.price));
            fd.append("description", form.description);
            fd.append("category", form.category);
            fd.append("stock", form.stock);

            // IMPORTANT: must match multer field name (commonly "images")
            files.forEach((f) => fd.append("images", f));

            const res = await api.post("/product/createProduct", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // axios style: res.data
            const data = res?.data;

            if (data?.success) {
                toast.success("Product created successfully");
                setForm({ title: "", price: "", description: "", category: "", stock: "" });
                setFiles([]);
            } else {
                toast.error(data?.message || "Failed to create product");
            }
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.message ||
                "Server error creating product";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <Toaster position="top-right" />

            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-1">
                    <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
                    <p className="text-sm text-slate-600">
                        Create a new product (up to {MAX_IMAGES} images)
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <form onSubmit={onSubmit} className="space-y-5">
                        {/* Fields */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={onChange}
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="price"
                                    value={form.price}
                                    onChange={onChange}
                                    disabled={loading}
                                    inputMode="decimal"
                                    placeholder="Rs"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Category
                                </label>
                                <input
                                    name="category"
                                    value={form.category}
                                    onChange={onChange}
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">
                                    Stock Status
                                </label>

                                <select
                                    name="stock"
                                    value={form.stock}
                                    onChange={onChange}
                                    disabled={loading}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                                >
                                    <option value="">Not Selected</option>
                                    <option value="In Stock">In Stock</option>
                                    <option value="Stock out">Stock out</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                disabled={loading}
                                placeholder="Write product details..."
                                className="min-h-[120px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                            />
                        </div>

                        {/* Upload Box */}
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-base font-bold text-slate-900">Product Images</p>
                                    <p className="text-sm text-slate-600">
                                        Upload up to {MAX_IMAGES} images
                                    </p>
                                </div>

                                <label
                                    className={`inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 ${loading || files.length >= MAX_IMAGES
                                        ? "pointer-events-none opacity-60"
                                        : ""
                                        }`}
                                >
                                    + Select Images
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={onPickFiles}
                                        disabled={loading || files.length >= MAX_IMAGES}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Previews */}
                            {previews.length ? (
                                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {previews.map((p, idx) => (
                                        <div
                                            key={p.url}
                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                                        >
                                            <img
                                                src={p.url}
                                                alt={p.name}
                                                className="h-36 w-full object-cover"
                                            />
                                            <div className="flex items-center justify-between gap-3 p-3">
                                                <p
                                                    className="truncate text-xs font-semibold text-slate-700"
                                                    title={p.name}
                                                >
                                                    {p.name}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFileAt(idx)}
                                                    disabled={loading}
                                                    className={`text-xs font-extrabold underline ${loading ? "opacity-60" : "hover:text-red-600"
                                                        }`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-slate-600">No images selected yet.</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 ${loading ? "pointer-events-none opacity-70" : ""
                                    }`}
                            >
                                {loading ? "Creating..." : "Create Product"}
                            </button>

                            {loading && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                                    Uploading images & saving product…
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}