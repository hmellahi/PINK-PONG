import { User, UserState } from "@/types/user";
import actions from "./actions";
import mutations from "./mutations";

const state = () => ({
  isAuthenticated: false, //false
  user: {},
  gameSocket: null,
  achievments: [
    {
      id: 1,
      title: "Play Your first Match",
      image: "/assets/img/badge6.png",
      checker: (user: User) => {
       // console.log("user wins", user)
        if (user.wins >= 1 || user.losses >= 1) return true;
        return false;
      },
    },
    {
      id: 2,
      title: "Earned 2 Matches",
      image: "/assets/img/badge1.png",
      checker: (user: User) => {
        if (user.wins >= 2) return true;
        return false;
      },
    },
    {
      id: 3,
      title: "Play 5 Matches",
      image: "/assets/img/badge3.png",
      checker: (user: User) => {
        let num = user.wins + user.losses;
        if (num >= 5) return true;
        return false;
      },
    },
    {
      id: 4,
      title: "Earned 5 Matches",
      image: "/assets/img/badge2.png",
      checker: (user: User) => {
        if (user.wins >= 5) return true;
        return false;
      },
    },
    {
      id: 5,
      title: "Earned 10 Matches",
      image: "/assets/img/badge4.png",
      checker: (user: User) => {
        if (user.wins >= 10) return true;
        return false;
      },
    },
    {
      id: 6,
      title: "Play 15 Matches",
      image: "/assets/img/badge5.png",
      checker: (user: User) => {
        let num = user.wins + user.losses;
        if (num >= 15) return true;
        return false;
      },
    },
    {
      id: 7,
      title: "Play 25 Matches",
      image: "/assets/img/badge7.png",
      checker: (user: User) => {
        let num = user.wins + user.losses;
        if (num >= 25) return true;
        return false;
      },
    },
    {
      id: 8,
      title: "Earned 15 Matches",
      image: "/assets/img/badge8.png",
      checker: (user: User) => {
        if (user.wins >= 15) return true;
        return false;
      },
    },
  ],
});

// getters
const getters = {
  getCurrentUser(state: UserState): User {
    return state.user;
  },
  getAchievments(state: UserState): User {
    return state.achievments;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
