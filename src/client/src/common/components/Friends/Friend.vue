<template>
  <div class="friend-info">
    <img :src="friend.avatarUrl" />
    <!-- <img src="/assets/img/2.jpg" alt="" /> -->
    <div class="content">
      <h6>{{ friend.username }}</h6>
      <span>Last online {{ friend.lastSeen }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Friend.vue",
};
// todo
</script>

<style scoped></style>
