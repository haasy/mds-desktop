<template>
  <div class="min-h-full flex-grow flex flex-col">
    <!-- TopNavBar -->
    <Topnavbar />
  
    <div
      id="app-content" 
      class="flex-grow flex flex-row"
    >
      <!-- Sidebar -->
      <Sidebar class=" overflow-x-hidden" />
      <!-- SubRouterView -->
      <router-view class="w-4/5 ml-4" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import {  useUserState,  useOperationsState, useGroupState} from '../store';
  import  Sidebar from '../components/SideBarMenu.vue';
  import Topnavbar from '../components/TopNavbar.vue';
  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const userState = useUserState();
  const operationsState = useOperationsState();
  const groupState = useGroupState();

  onMounted(() => {
    userState.dispatch('retrieveUsers', {});
    operationsState.dispatch('retrieveOperations', {});
    groupState.dispatch('retrieveGroups', {});
  });
</script>
<style scoped>
  .bottomPartwithSidebar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--1);
  }
  .bottomPartwithSidebar > :first-child{
    flex-basis: 1;
  }
  .bottomPartwithSidebar > :last-child{
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 75%;
  }
</style>
