<template>
  <div 
    :class="loggingIn()? 'cursor-wait':''" 
    class="w-screen h-screen grid place-items-center"
  >
    <div>
      <!-- Header -->
      <h1 class="text-4xl font-bold text-on_background text-center">
        Mobile Directing System
      </h1>
      <!-- Login Form -->
      <LoginForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoginForm from './../components/LoginForm.vue';
  import { useLoginState } from '../store';
  import { computed } from 'vue';

  const loginState = useLoginState();
  const loggingIn = computed(() => loginState.getters.loggingIn);
</script>