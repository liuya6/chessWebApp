const User = () => import("../views/user/User");
const Login = () => import("../views/user/login");
const Register = () => import("../views/user/Register");
export default [
  {
    path: "/user",
    name: "user",
    component: User,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  }
];
