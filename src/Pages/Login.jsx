import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { LoginValidation } from "./loginValidation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

const initialValues = {
  email: "",
  pass: "",
};

function Login() {
  const navigate = useNavigate();
  const { login, authLoading, setAuthError } = useAuth();

  // PASSWORD TOGGLE STATE (SAFE)
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-10">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-widest">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500">
              BOOK-TALES
            </span>
          </h1>
          <p className="mt-3 text-gray-300 font-bold tracking-wide">
            POWER UP & ENTER THE UNIVERSE
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-2xl blur opacity-30"></div>

          <div className="relative bg-gray-900 border-4 border-yellow-400 rounded-2xl shadow-[12px_12px_0_#facc15] p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={LoginValidation}
              onSubmit={async (values, { setSubmitting }) => {
                setAuthError("");

                const result = await login(
                  values.email,
                  values.pass
                );

                if (result.success) {
                 if (result.user.roles?.some(
                    (role) => role.toLowerCase() === "admin"
                  )) {
                    navigate("/admin", { replace: true });
                  } else {
                    navigate("/", { replace: true });
                  }
                }

                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* EMAIL */}
                  <Input
                    icon={<Mail />}
                    name="email"
                    label="HERO EMAIL"
                    placeholder="hero@universe.com"
                    error={errors.email}
                    touched={touched.email}
                  />

                  {/* PASSWORD WITH TOGGLE */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-bold text-white">
                      <span className="text-yellow-400">
                        <Lock />
                      </span>
                      SECRET CODE
                    </label>

                    <div className="relative">
                      <Field
                        name="pass"
                        type={
                          showPassword ? "text" : "password"
                        }
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 bg-gray-800 border-3 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((p) => !p)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                                        {errors.pass && touched.pass && (
                      <p className="mt-1 text-red-400 text-sm font-bold">
                        {errors.pass}
                      </p>
                    )}

                    <div className="text-right mt-2">
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-blue-400 font-bold text-sm hover:underline"
                      >
                        FORGOT PASSWORD?
                      </button>
                    </div>

                  </div>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    className="w-full mt-4 py-4 text-xl font-extrabold text-black bg-yellow-400 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] transition disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting || authLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        AUTHENTICATING
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        POWER UP
                      </>
                    )}
                  </button>

                  {/* REGISTER LINK */}
                  <div className="text-center pt-4 border-t border-gray-700">
                    <p className="text-gray-400 mb-2">
                      NEW TO BOOK-TALES?
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      CREATE HERO ACCOUNT →
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

// INPUT COMPONENT
const Input = ({ icon, label, error, touched, ...props }) => (
  <div>
    <label className="flex items-center gap-2 mb-2 font-bold text-white">
      <span className="text-yellow-400">{icon}</span>
      {label}
    </label>
    <Field
      {...props}
      className="w-full px-4 py-3 bg-gray-800 border-3 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition"
    />
    {error && touched && (
      <p className="mt-1 text-red-400 text-sm font-bold">
        {error}
      </p>
    )}
  </div>
);

export default Login;
