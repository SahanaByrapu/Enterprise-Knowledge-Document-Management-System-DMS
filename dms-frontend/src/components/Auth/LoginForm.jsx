import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login } from "../../services/authService"; // TS service

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password required"),
}).required();

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password); // Call TS auth service
      console.log("Logged in:", res);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">DMS Login</h2>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input type="email" {...register("email")} className="w-full p-2 border rounded" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input type="password" {...register("password")} className="w-full p-2 border rounded" />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Login
      </button>
    </form>
  );
};

export default LoginForm;