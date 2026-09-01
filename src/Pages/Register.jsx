import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { SignupValidation } from "../Pages/SignupValidation";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Shield,
  Rocket,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const initialValues = {
  FirstName: "",
  LastName: "",
  email: "",
  phoneNumber: "",
  pass: "",
  cpass: "",
};

function Register() {
  const navigate = useNavigate();
  const { register, authLoading, setAuthError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-widest">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500">
              BOOK-TALES
            </span>
          </h1>

          <p className="mt-3 text-gray-300 font-bold tracking-wide">
            CREATE YOUR SUPERHERO PROFILE
          </p>
        </div>

        {/* FORM CARD */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>

          <div className="relative bg-gray-900 border-4 border-blue-500 rounded-2xl shadow-[12px_12px_0_#2563eb] p-8">

            <Formik
              initialValues={initialValues}
              validationSchema={SignupValidation}
              onSubmit={async (
                values,
                { resetForm, setSubmitting }
              ) => {
                setAuthError("");

                const result = await register({
                  firstName: values.FirstName,
                  lastName: values.LastName,
                  email: values.email,
                  phoneNumber: values.phoneNumber,
                  password: values.pass,
                  confirmPassword: values.cpass,
                });

               if (result.success) {
                 resetForm();

                  navigate("/verify-otp", {
                    state: {
                    email: values.email,
                  },
              });
            }

                setSubmitting(false);
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">

                  {/* FIRST + LAST NAME */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Input
                      icon={<User />}
                      name="FirstName"
                      label="FIRST NAME"
                      placeholder="Tony"
                      error={errors.FirstName}
                      touched={touched.FirstName}
                    />

                    <Input
                      icon={<User />}
                      name="LastName"
                      label="LAST NAME"
                      placeholder="Stark"
                      error={errors.LastName}
                      touched={touched.LastName}
                    />

                  </div>

                  {/* EMAIL */}
                  <Input
                    icon={<Mail />}
                    name="email"
                    label="EMAIL"
                    placeholder="ironman@avengers.com"
                    type="email"
                    error={errors.email}
                    touched={touched.email}
                  />

                  {/* PHONE */}
                  <Input
                    icon={<Phone />}
                    name="phoneNumber"
                    label="PHONE NUMBER"
                    placeholder="9876543210"
                    type="tel"
                    error={errors.phoneNumber}
                    touched={touched.phoneNumber}
                  />

                  {/* PASSWORD + CONFIRM PASSWORD */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* PASSWORD */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-bold text-white">
                        <span className="text-yellow-400">
                          <Lock />
                        </span>
                        PASSWORD
                      </label>

                      <div className="relative">

                        <Field
                          name="pass"
                          type={showPassword ? "text" : "password"}
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
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <Input
                      icon={<Shield />}
                      name="cpass"
                      type="password"
                      label="CONFIRM PASSWORD"
                      placeholder="••••••••"
                      error={errors.cpass}
                      touched={touched.cpass}
                    />

                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    className="w-full mt-4 py-4 text-xl font-extrabold text-black bg-yellow-400 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] transition disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting || authLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        CREATING PROFILE
                      </>
                    ) : (
                      <>
                        <Rocket className="w-6 h-6" />
                        JOIN THE UNIVERSE
                      </>
                    )}
                  </button>

                  {/* LOGIN */}
                  <div className="text-center pt-4 border-t border-gray-700">

                    <p className="text-gray-400 mb-2">
                      ALREADY A HERO?
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      POWER UP & LOGIN →
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

/* INPUT COMPONENT */
const Input = ({
  icon,
  label,
  error,
  touched,
  ...props
}) => (
  <div>

    <label className="flex items-center gap-2 mb-2 font-bold text-white">
      <span className="text-yellow-400">
        {icon}
      </span>

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

export default Register;