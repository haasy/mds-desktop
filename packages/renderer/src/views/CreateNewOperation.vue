<template>
  <div>
    <div
      id="create-new-operation-form"
      class=" bg-white ml-4 max-w-lg rounded-lg  my-10"
    >
      <header class=" max-w-lg pb-10">
        <h1 class="text-4xl font-bold text-black ">
          Create a new Operation
        </h1>        
      </header>
      <form class="w-80">
        <main class="">
          <!------- Title  ------>
          <div class="mb-6">
            <FormInput
              id="create-operation-title"
              v-model="title"
              label="Title"
              required
            />
          </div>
          <!------- Description  ------>
          <div class="mb-6">
            <FormInput
              id="create-operation-description"
              v-model="description"
              label="Description"
            />
          </div>
          <!------- Start  ------>
          <div class="mb-6">
            <FormInput
              id="create-operation-start"
              v-model="start"
              label="Start"
              type="datetime-local"
              required
            />
          </div>
          <!--- End --->
          <div class="mb-6">
            <FormInput
              id="create-operation-end"
              v-model="end"
              label="End"
              type="datetime-local"
              :min="start"
            />
          </div>
          <!-- Operation Member Selection -->
          <div
            v-if="!checkPermissions([{name: PermissionNames.OperationMembersView}])"
            class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            You lack the operation members view permission, as such you cannot see or change the operation members.
          </div>
          <div
            v-if="!checkPermissions([{name: PermissionNames.UserView}])"
            class="bg-error_superlight border-2 w-100 mb-6 p-1 border-error_dark text-on_error_superlight rounded"
          >
            You lack the user view permission, as such you cannot add operation members.
          </div>
          <div
            v-if="checkPermissions([{name: PermissionNames.OperationMembersView}])" 
            class="mb-6"
          >
            <MemberSelection
              id="create-operation-operation-members"
              v-model="operationMemberIds"
              :disable-add-members="!checkPermissions([{name: PermissionNames.OperationMembersUpdate}, {name: PermissionNames.UserView}])"
              :disable-remove-members="!checkPermissions([{name: PermissionNames.OperationMembersUpdate}])"
            />
          </div>
        </main>
      </form>
      <div class="flex justify-between">
        <!-- Create Operation Button -->
        <NormalButton 
          v-if="title != '' && start && (!end || new Date(start) < new Date(end))"
          id="create-operation-button"
          @click.prevent="createNewOperation(title, description, start, end)"
        >
          Create Operation
        </NormalButton>
        <!-- Cancel Button -->
        <NormalButton
          id="create-operation-cancel-button"
          class=" ml-auto"
          @click.prevent="router.push('/operation')"
        >
          Cancel
        </NormalButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';
    import NormalButton from '../components/BasicComponents/NormalButton.vue';
    import MemberSelection from '../components/MemberSelection.vue';
    import { useOperationsState } from '../store';
    import{useRouter} from 'vue-router';
    import type {Operation} from '../../../types';
    import FormInput from '../components/BasicComponents/FormInput.vue';
    import type {Ref} from 'vue';
    import { usePermissions } from '../composables';
    import { PermissionNames } from '../constants';

    const title = ref('');
    const description = ref('');
    const start = ref('');
    const end = ref(''); 
    const operationMemberIds: Ref<string[]> = ref([]);
    const operationState = useOperationsState();
    const router = useRouter();
    const checkPermissions = usePermissions();

    /**
     * function to create new operation object and initiate call to backend. Click handler for the create opertion button.
     * @param titleI title of the new operation
     * @param descriptionI description of the new operation
     * @param startI start datetime of the new operation
     * @param endI end datetime of the new operation
     */
    /* eslint-disable */
    function createNewOperation( titleI: string, descriptionI: string, startI :string, endI : string) {
        const newOperation:Operation = {
            id: '',
            title: titleI,
            description: descriptionI? descriptionI : undefined,
            start: startI? new Date(startI) : undefined,
            end: endI? new Date(endI) : undefined,
            is_archived: false,
        };

        operationState.dispatch('createOperation', {operation: newOperation, memberIds: checkPermissions([{name: PermissionNames.OperationMembersUpdate}])? operationMemberIds.value : []});
        title.value ='';
        description.value ='';
        end.value='';
        start.value='';
        operationMemberIds.value = [];
  }
  /* eslint-enable */

</script>