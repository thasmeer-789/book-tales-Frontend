import * as Yup from "yup";

export const SignupValidation = Yup.object({
  FirstName: Yup.string()
    .min(3)
    .required("Please Enter Name"),

  LastName: Yup.string()
    .min(3)
    .required("Please Enter Name"),

  email: Yup.string()
    .email("Please Enter Valid Email")
    .required("Please Enter Email"),

  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Please Enter Phone Number"),

  pass: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Za-z]/, "Must contain at least one letter")
    .matches(/[0-9]/, "Must contain a number")
    .required("Password is required"),

  cpass: Yup.string()
    .oneOf([Yup.ref("pass")], "Password Not Matched")
    .required("Password is required"),
});