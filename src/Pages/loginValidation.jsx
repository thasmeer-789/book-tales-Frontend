import * as Yup from 'yup'

export const LoginValidation = Yup.object({
    email: Yup.string().email("Please Enter Vaild email").required("Please Enter Email"),
    pass :Yup.string().min(8,"Password must be at least 8 characters").matches(/[A-Za-z]/,"Must contain at least one letter").matches(/[0-9]/,"Must contain a number").required("Password is required")
})