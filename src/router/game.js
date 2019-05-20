const Chess = () => import("../views/game/Chess");
const Electronic = () => import("../views/game/Electronic");
const RealPerson = () => import("../views/game/RealPerson");
const StartHall = () => import("../views/game/StartHall");

export default [
  {
    path: "/chess",
    name: "QP",
    component: Chess
  },
  {
    path: "/arcade",
    name: "DZ",
    component: Electronic
  },
  {
    path: "/live",
    name: "SX",
    component: RealPerson
  },
  {
    path: "/playing",
    name: "playing",
    component: StartHall
  }
];
