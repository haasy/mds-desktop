<template>
  <!-- Floating Error Container -->
  <div
    v-if="errors().length + notifications().length > 0"
    class="z-50 absolute mx-auto w-96 max-w-sm p-4 grid grid-cols-1 left-1/2 transform -translate-x-1/2 "
    role="alert"
  >
    <!-- Error Toasts -->
    <div
      v-for="error in errors().slice(0, 3)"
      :key="error.errorId"
      class="text-on_error_light bg-error_light rounded-lg shadow mb-1 flex items-center"
    >
      <!-- Error Message -->
      <div class="ml-3 text-sm font-normal inline-flex w-72 max-w-xs overflow-x-hidden max-h-16">
        {{ error.errorMessage }}
      </div>
      <!-- Close Error Button -->
      <button
        type="button"
        class="ml-auto mt-1 mb-1 mr-1 bg-error_light text-on_error_light hover:bg-error_dark rounded-lg focus:ring-2 focus:ring-error p-1.5 inline-flex h-8 w-8"
        aria-label="Close"
        @click.prevent="removeError(error.errorId)"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      v-for="notification in notifications().slice(0, 3 - Math.min(errors().length, 3))"
      :key="notification.notificationId"
      class="text-on_success_light bg-success_light rounded-lg shadow mb-1 flex items-center"
    >
      <!-- Notification Message -->
      <div class="ml-3 text-sm font-normal inline-flex w-72 max-w-xs overflow-x-hidden max-h-16">
        {{ printNotificiation(notification.inAppNotification) }}
      </div>
      <!-- Close Notification Button -->
      <button
        type="button"
        class="ml-auto mt-1 mb-1 mr-1 bg-success_light text-on_success_superlight hover:bg-success_dark rounded-lg focus:ring-2 focus:ring-success p-1.5 inline-flex h-8 w-8"
        aria-label="Close"
        @click.prevent="removeNotification(notification.notificationId)"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  /**
   * This component that displays errors and notifications in the form of floating toasts at the 
   * top of the app. The oldest 3 errors and notifications displayed. Here errors have priority over
   * notifications, so if there are 2 errors and 4 notifications, the 2 errors and 1 notification are
   * displayed. The toasts disappear after 10s or if they are manually closed using the x button on 
   * the toasts. If this happens and more newer errors they are then displayed in the same way.
   */
  import {computed} from 'vue';
  import type { InAppNotification, PlainTextContent } from '../../../../types';
  import { useErrorState, useInAppNotificationState } from '../../store';
  import { IntelType } from '../../constants';

  const errorState = useErrorState();
  const notificationState = useInAppNotificationState();
  const errors = computed(() => errorState.getters.errors);
  const notifications = computed(() => notificationState.getters.shownNotifications);
  
  /**
   * function to remove Error from the error state, including the timeout
   * @param errorId id of the error to remove
   */
  function removeError(errorId: string) {
    errorState.dispatch('removeError', errorId);
  }
  function printNotificiation(notification: InAppNotification):string {
    // Switch between different notification types
    if(notification.type === 'intel-notification') {
      // Switch between different payload types
      if(notification.payload.intel_to_deliver.type === IntelType.plaintext_message) {
        // For plaintext payloads the first 60 characters are displayed
        const content = (notification.payload.intel_to_deliver.content as PlainTextContent).text.slice(0, 60);
        return `You got new plaintext intel: ${content.endsWith(' ')? content.substring(0, -1) : content}...`;
      }
      if(notification.payload.intel_to_deliver.type === IntelType.analog_radio_message) {
        // For analog radio message display the first 60 characters of the subject
        //fix this in the backend or in the backend comms code in the future
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = (notification.payload.intel_to_deliver.content as any).Head.slice(0, 50);
        return `You got new analog radio intel: ${content.endsWith(' ')? content.substring(0, -1) : content}...`;
      }
    }
    return '';
  }
  /**
   * function to remove Notifications from the shownNotification state including the timeout
   * @param notificationId id of the notification to remove
   */
  function removeNotification(notificationId: string) {
    notificationState.dispatch('removeShownNotification', notificationId);
  }

</script>