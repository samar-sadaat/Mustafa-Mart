import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setShipping } from "../../store/cartSlice";

const normalizePhone = (value = "") => value.replace(/\D/g, "");

const formatPhone = (digits = "") => {
  const d = digits.slice(0, 11);
  if (d.length <= 4) return d;
  return `${d.slice(0, 4)}-${d.slice(4)}`;
};

const allSame = (str = "") => str.length > 0 && str.split("").every((ch) => ch === str[0]);

const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .matches(/^[A-Za-z ]+$/, "Name must contain only alphabets")
    .test("min-letters", "Name must be at least 3 letters", (value) => {
      if (!value) return false;
      const lettersOnly = value.replace(/\s/g, "");
      return lettersOnly.length >= 3;
    })
    .required("Full name is required"),

  phone: Yup.string()
    .required("Phone is required")
    .test("pk-phone", "Phone must be like 0300-1234567", (value) => {
      const digits = normalizePhone(value);
      return /^03\d{9}$/.test(digits);
    })
    .test("last7", "Last 7 digits cannot be all same", (value) => {
      const digits = normalizePhone(value);
      if (digits.length !== 11) return true;
      const last7 = digits.slice(-7);
      return !allSame(last7);
    })
    .test("last9", "Last 9 digits cannot be all same", (value) => {
      const digits = normalizePhone(value);
      if (digits.length !== 11) return true;
      const last9 = digits.slice(-9);
      return !allSame(last9);
    }),

  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  notes: Yup.string().trim(),
});

export default function ShippingPage() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const shipping = useSelector((state) => state.cart.shipping);
  const user = useSelector((state) => state.auth.user);

  const hasItems = items.length > 0;

  // prefer saved shipping data, otherwise prefill from user
  const initialFullName =
    shipping?.fullName?.trim() ||
    user?.name ||
    "";

  const initialPhone =
    shipping?.phone?.trim() ||
    user?.phone ||
    "";

  const initialAddress =
    shipping?.address?.trim() ||
    user?.address?.line1 ||
    "";

  const initialCity =
    shipping?.city?.trim() ||
    user?.address?.line2 ||
    "";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: initialFullName,
      phone: initialPhone,
      address: initialAddress,
      city: initialCity,
      notes: shipping?.notes || "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        setShipping({
          fullName: values.fullName.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          notes: values.notes.trim(),
        })
      );

      nav("/checkout/payment");
    },
  });

  const err = (key) =>
    formik.touched[key] && formik.errors[key] ? formik.errors[key] : "";

  const handlePhoneChange = (e) => {
    const digits = normalizePhone(e.target.value);
    formik.setFieldValue("phone", formatPhone(digits));
  };

  return (
    <Container>
      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h1 className="text-2xl font-extrabold">Shipping Details</h1>
          <p className="mt-1 text-sm text-slate-300">
            Enter your address to deliver your order.
          </p>
        </section>

        {!hasItems ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="font-semibold">Your cart is empty.</div>
          </div>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <input
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Full name"
                  className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm outline-none text-white
                    ${err("fullName") ? "border-red-400/60" : "border-white/10"}`}
                  required
                />
                {err("fullName") ? (
                  <p className="mt-1 text-xs text-red-300">{err("fullName")}</p>
                ) : null}
              </div>

              <div>
                <input
                  name="phone"
                  value={formik.values.phone}
                  onChange={handlePhoneChange}
                  onBlur={formik.handleBlur}
                  placeholder="0300-1234567"
                  inputMode="numeric"
                  className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm outline-none text-white
                    ${err("phone") ? "border-red-400/60" : "border-white/10"}`}
                  required
                />
                {err("phone") ? (
                  <p className="mt-1 text-xs text-red-300">{err("phone")}</p>
                ) : null}
              </div>
            </div>

            <div>
              <input
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Address"
                className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm outline-none text-white
                  ${err("address") ? "border-red-400/60" : "border-white/10"}`}
                required
              />
              {err("address") ? (
                <p className="mt-1 text-xs text-red-300">{err("address")}</p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <input
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="City"
                  className={`w-full rounded-xl border bg-white/5 px-3 py-3 text-sm outline-none text-white
                    ${err("city") ? "border-red-400/60" : "border-white/10"}`}
                  required
                />
                {err("city") ? (
                  <p className="mt-1 text-xs text-red-300">{err("city")}</p>
                ) : null}
              </div>

              <div>
                <input
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Notes (optional)"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!formik.isValid}
              className="w-full rounded-xl border border-violet-400/30 bg-violet-500/25 px-4 py-3 text-sm font-semibold hover:bg-violet-500/35 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </form>
        )}
      </div>
    </Container>
  );
}