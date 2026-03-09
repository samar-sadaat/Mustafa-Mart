import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";

const nameRegex = /^[A-Za-z]+$/;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(3, "First name must be at least 3 letters")
    .matches(nameRegex, "Only letters allowed")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(3, "Last name must be at least 3 letters")
    .matches(nameRegex, "Only letters allowed")
    .required("Last name is required"),

  email: Yup.string()
    .trim()
    .matches(/^[A-Za-z]/, "Email must start with a letter")
    .email("Enter a valid email")
    .test("domain", "Only gmail.com or hotmail.com allowed", (value) => {
      if (!value) return false;
      const domain = value.split("@")[1]?.toLowerCase();
      return domain === "gmail.com" || domain === "hotmail.com";
    })
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payload = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        };

        const res = await api.post("/user/signup", payload);
        toast.success(res.data.message || "Account created");

        formik.resetForm();

        navigate('/');
      } catch (err) {
        // ✅ toast only for backend errors
        toast.error(err?.response?.data?.message || err.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const err = (key) =>
    formik.touched[key] && formik.errors[key] ? formik.errors[key] : "";

  return (
    <div className="min-h-screen bg-[#070A14] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="mt-8 mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.8)]" />
          <div>
            <p className="text-sm text-white/60">Mustafa Mart</p>
            <h1 className="text-white font-semibold tracking-tight">Create your account</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="text-white">
            <h2 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight">
              Join <span className="text-purple-300">Mustafa Mart</span> today.
            </h2>
            <p className="mt-4 text-white/70 max-w-xl">
              Create an account to save your profile, track orders, and get personalized deals.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 max-w-xl">
              <p className="text-sm text-white/80 font-semibold">Why sign up?</p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400/80" />
                  Faster checkout & saved address
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400/80" />
                  Exclusive daily deals
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400/80" />
                  Track your orders easily
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
              <h3 className="text-white text-xl font-semibold">Sign up</h3>
              <p className="text-white/60 text-sm mt-1">
                Use your details to create a new account
              </p>

              <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60">First name</label>
                    <input
                      name="firstName"
                      value={formik.values.firstName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Mustafa"
                      className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-white/30 outline-none
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
                      placeholder="Khan"
                      className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-white/30 outline-none
                        ${err("lastName") ? "border-red-400/60" : "border-white/10"}
                        focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                    />
                    {err("lastName") ? (
                      <p className="mt-1 text-xs text-red-300">{err("lastName")}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60">Email</label>
                  <input
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@gmail.com"
                    className={`mt-2 w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder:text-white/30 outline-none
                      ${err("email") ? "border-red-400/60" : "border-white/10"}
                      focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                  />
                  {err("email") ? (
                    <p className="mt-1 text-xs text-red-300">{err("email")}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-white/60">Password</label>
                  <div className="mt-2 relative">
                    <input
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Create a strong password"
                      className={`w-full rounded-xl bg-black/30 border pl-4 pr-14 py-3 text-white placeholder:text-white/30 outline-none
                        ${err("password") ? "border-red-400/60" : "border-white/10"}
                        focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {err("password") ? (
                    <p className="mt-1 text-xs text-red-300">{err("password")}</p>
                  ) : null}
                </div>

                <div>
                  <label className="text-xs text-white/60">Confirm password</label>
                  <div className="mt-2 relative">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Re-enter password"
                      className={`w-full rounded-xl bg-black/30 border pl-4 pr-14 py-3 text-white placeholder:text-white/30 outline-none
                        ${err("confirmPassword") ? "border-red-400/60" : "border-white/10"}
                        focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/60`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {err("confirmPassword") ? (
                    <p className="mt-1 text-xs text-red-300">{err("confirmPassword")}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition shadow-[0_0_25px_rgba(168,85,247,0.35)]"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>

                <p className="text-center text-sm text-white/60">
                  Already have an account?{" "}
                  <a className="text-purple-300 hover:text-purple-200" href="/signin">
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="pb-10" />
      </div>
    </div>
  );
}