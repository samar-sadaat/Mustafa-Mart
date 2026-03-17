import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../utils/adminApi";

const signinSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function AdminSignin() {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const submit = async (values, { setSubmitting }) => {
    try {
      await apiRequest("/admin/signin", {
        method: "POST",
        body: JSON.stringify(values),
        credentials: "include",
      });

      navigate("/admin/");
    } catch (error) {
      alert(error.message || "Signin failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-3xl font-bold">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage products and orders.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={signinSchema}
            onSubmit={submit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="mt-6 space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`w-full rounded-2xl border px-4 py-3 outline-none ${
                      touched.email && errors.email
                        ? "border-red-500 bg-slate-800"
                        : "border-slate-800 bg-slate-800"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-sm text-red-400"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={`w-full rounded-2xl border px-4 py-3 outline-none ${
                      touched.password && errors.password
                        ? "border-red-500 bg-slate-800"
                        : "border-slate-800 bg-slate-800"
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-violet-600 py-3 font-semibold hover:bg-violet-500 disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}