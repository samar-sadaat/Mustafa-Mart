import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/api";


export default function Signin() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.password) return toast.error("Password is required");

    setLoading(true);
    try {
      const res = await api.post("/user/signin", {
        email: form.email.trim(),
        password: form.password,
      });

      dispatch(setUser(res.data.userData));

      toast.success(res.data.message || "Signed in");

      // navigate('/user-profile')
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A14] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-76 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.8)]" />
            <div>
              <p className="text-sm text-white/60">Mustafa Mart</p>
              <h1 className="text-white font-semibold tracking-tight">Welcome back</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="text-white">
            <h2 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
              Your online mart for{" "}
              <span className="text-purple-300">everything</span> you need.
            </h2>

            <p className="mt-4 text-white/70 max-w-xl">
              Sign in to browse products, add to cart, and checkout quickly — all in one place.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xl font-bold">10k+</p>
                <p className="text-xs text-white/60 mt-1">Products</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xl font-bold">4.8★</p>
                <p className="text-xs text-white/60 mt-1">Avg rating</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xl font-bold">24/7</p>
                <p className="text-xs text-white/60 mt-1">Support</p>
              </div>
            </div>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
              <h3 className="text-white text-xl font-semibold">Sign in</h3>
              <p className="text-white/60 text-sm mt-1">
                Enter your email and password to continue
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-white/60">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">Password</label>
                  <div className="mt-2 relative">
                    <input
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={onChange}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-black/30 border border-white/10 pl-4 pr-14 py-3 text-white placeholder:text-white/30 outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition shadow-[0_0_25px_rgba(168,85,247,0.35)]"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <p className="text-center text-sm text-white/60">
                  Don’t have an account?{" "}
                  <Link to="/signup">Create one</Link>
                </p>
              </form>
            </div>

            <p className="mt-4 text-center text-xs text-white/40">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}