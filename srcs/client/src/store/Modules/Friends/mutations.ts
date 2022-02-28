// mutations

import { FriendsState, friendShipStatus } from "@/types/user";
// interface Payload : Array<any> {
//   entityName: friendShipStatus;
//   entity: any;

type Payload = [friendShipStatus, any];

const mutations = {
  SET_ENTITY(state: FriendsState, [entityName, entity]: Payload): void {
      state[entityName] = entity;
  },
  REMOVE_FROM(state: FriendsState, [entityName, entity]: Payload): boolean {
    let found = false;
    state[entityName] = state[entityName].filter((element) => {
      if (element != entity) return true;
      found = true;
      return false;
    });
    return found;
  },

  ADD_TO_ENTITY(state: any, [entityName, entityToAdd]: Payload) {
    state[entityName].push(entityToAdd);
  },
  RESET_STATE(state: any, prevstate: any): void {
    state = prevstate;
  },
};

export default mutations;
