import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { api } from "../../api/api";
import { setUser } from "../../store/authSlice";

function splitName(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

// ✅ only alphabets
const nameRegex = /^[A-Za-z]+$/;

// ✅ phone helpers
const normalizePhone = (value = "") => value.replace(/\D/g, ""); // digits only

const formatPhone = (digits = "") => {
  // Expect 11 digits: 03XX + 7 digits
  const d = digits.slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)}-${d.slice(4)}`;
};

const isAllSame = (str) => str.split("").every((ch) => ch === str[0]);

const today = new Date();
const isFutureDate = (dateStr) => {
  const d = new Date(dateStr);
  // compare without time
  return d.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
};

const ageInYears = (dateStr) => {
  const dob = new Date(dateStr);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(3, "First name must be at least 3 letters")
    .matches(nameRegex, "Only alphabets allowed")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(3, "Last name must be at least 3 letters")
    .matches(nameRegex, "Only alphabets allowed")
    .required("Last name is required"),

  phone: Yup.string()
    .trim()
    .test("pk-phone", "Phone must be like 03XX-XXXXXXX", (value) => {
      if (!value) return true; // optional
      const digits = normalizePhone(value);
      if (digits.length !== 11) return false;
      if (!digits.startsWith("03")) return false;
      return true;
    })
    .test("not-same-last9", "Phone last 9 digits cannot be all same", (value) => {
      if (!value) return true;
      const digits = normalizePhone(value);
      if (digits.length !== 11) return true; // already handled
      const last9 = digits.slice(2); // after "03"
      return !isAllSame(last9);
    }),

  dob: Yup.string()
    .nullable()
    .test("not-future", "DOB cannot be in the future", (value) => {
      if (!value) return true;
      return !isFutureDate(value);
    })
    .test("min-age", "You must be at least 14 years old", (value) => {
      if (!value) return true;
      return ageInYears(value) >= 14;
    }),
});

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fileRef = useRef(null);

  // ✅ Guard (prevents crash if user not loaded yet)
  if (!user) {
    return (
      <div className="min-h-[60vh] bg-[#070A14] rounded-3xl border border-white/10 p-6 text-white/70">
        Loading profile...
      </div>
    );
  }

  const { firstName, lastName } = splitName(user.name || "");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName,
      lastName,
      phone: user.phone || "",
      gender: user.gender || "Not Selected",
      dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
      addressLine1: user.address?.line1 || "",
      addressLine2: user.address?.line2 || "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const addressObj = {
          line1: values.addressLine1 || "",
          line2: values.addressLine2 || "",
        };

        let res;

        if (selectedImage) {
          const fd = new FormData();
          fd.append("firstName", values.firstName.trim());
          fd.append("lastName", values.lastName.trim());

          // send digits formatted for backend if you want, here we keep formatted
          fd.append("phone", values.phone || "");
          fd.append("gender", values.gender);
          if (values.dob) fd.append("dob", values.dob);

          fd.append("address", JSON.stringify(addressObj));
          fd.append("image", selectedImage);

          res = await api.patch("/user/update-profile", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          res = await api.patch("/user/update-profile", {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            phone: values.phone || "",
            gender: values.gender,
            dob: values.dob || "",
            address: addressObj,
          });
        }

        toast.success(res.data.message || "Profile updated");
        if (res.data.user) dispatch(setUser(res.data.user));

        setSelectedImage(null);
        setImagePreview("");
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message || "Update failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const err = (key) => (formik.touched[key] && formik.errors[key] ? formik.errors[key] : "");

  // ✅ image preview
  useEffect(() => {
    if (!selectedImage) return;
    const url = URL.createObjectURL(selectedImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const shownImage = imagePreview || user.image || "";

  const initials = useMemo(() => {
    const a = (formik.values.firstName || "").slice(0, 1).toUpperCase();
    const b = (formik.values.lastName || "").slice(0, 1).toUpperCase();
    return (a + b) || "U";
  }, [formik.values.firstName, formik.values.lastName]);

  const removeChosenFile = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // ✅ phone input behavior: allow typing only digits, auto format 03XX-XXXXXXX
  const handlePhoneChange = (e) => {
    const digits = normalizePhone(e.target.value);

    // allow only starting with 0 or empty, but not required
    const capped = digits.slice(0, 11);
    const formatted = formatPhone(capped);

    formik.setFieldValue("phone", formatted);
  };

  return (
    <div className="min-h-screen bg-[#070A14] relative overflow-hidden rounded-3xl border border-white/5">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div>
          <p className="text-sm text-white/60">Mustafa Mart</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Profile
          </h1>
          <p className="mt-1 text-white/60 text-sm">
            Update your personal information and profile picture.
          </p>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Left card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-4 flex-col">
              {/* ✅ Clickable Avatar with hover overlay */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative h-52 w-52 rounded-full overflow-hidden border border-white/10 bg-black/30 flex items-center justify-center"
                title="Update photo"
              >
                {shownImage ? (
                  <img
                    src={shownImage}
                    alt="profile"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">{initials}</span>
                )}

                {/* overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-sm font-semibold px-4 py-2 rounded-xl border border-white/15 bg-white/10">
                    Update photo
                  </span>
                </div>
              </button>

              {/* hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />

              <div className="min-w-0 text-center">
                <p className="text-white font-semibold truncate">
                  {`${formik.values.firstName} ${formik.values.lastName}`.trim() || "User"}
                </p>
                <p className="text-white/60 text-sm">{user.email}</p>
              </div>
            </div>

            {selectedImage ? (
              <button
                type="button"
                onClick={removeChosenFile}
                className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Remove chosen file
              </button>
            ) : null}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <h2 className="text-white text-xl font-semibold">Edit information</h2>

            <form onSubmit={formik.handleSubmit} className="mt-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60">First name</label>
                  <input
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white outline-none
                      ${err("firstName") ? "border-red-400/60" : "border-white/10"}
                      focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                  />
                  {err("firstName") ? (
                    <p className="mt-1 text-xs text-red-300">{err("firstName")}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-white/60">Last name</label>
                  <input
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white outline-none
                      ${err("lastName") ? "border-red-400/60" : "border-white/10"}
                      focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                  />
                  {err("lastName") ? (
                    <p className="mt-1 text-xs text-red-300">{err("lastName")}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60">Phone</label>
                  <input
                    name="phone"
                    value={formik.values.phone}
                    onChange={handlePhoneChange}
                    onBlur={formik.handleBlur}
                    placeholder="03XX-XXXXXXX"
                    inputMode="numeric"
                    className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white outline-none
                      ${err("phone") ? "border-red-400/60" : "border-white/10"}
                      focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                  />
                  {err("phone") ? (
                    <p className="mt-1 text-xs text-red-300">{err("phone")}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-white/60">Gender</label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60"
                  >
                    <option className="bg-slate-950" value="Not Selected">Not Selected</option>
                    <option className="bg-slate-950" value="Male">Male</option>
                    <option className="bg-slate-950" value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60">Date of birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white outline-none
                      ${err("dob") ? "border-red-400/60" : "border-white/10"}
                      focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                  />
                  {err("dob") ? (
                    <p className="mt-1 text-xs text-red-300">{err("dob")}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60">Street</label>
                  <input
                    name="addressLine1"
                    value={formik.values.addressLine1}
                    onChange={formik.handleChange}
                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">City, Country</label>
                  <input
                    name="addressLine2"
                    value={formik.values.addressLine2}
                    onChange={formik.handleChange}
                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                <p className="text-xs text-white/50">Changes will be saved to your account.</p>

                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className="rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 transition shadow-[0_0_25px_rgba(168,85,247,0.35)]"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}