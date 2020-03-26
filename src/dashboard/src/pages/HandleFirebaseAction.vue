<template>
  <AuthLayout>
    <logo />
    <ResetPasswordForm v-if="mode === 'resetPassword'" :code="oobCode" />
    <div class="plico-error" v-else>Invalid link provided</div>
  </AuthLayout>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import ResetPasswordForm from '@/components/ResetPasswordForm.vue';

function getParameterByName(name: string) {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if (results == null) return '';
  else return decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default {
  name: 'HandleFirebaseAction',
  components: {
    ResetPasswordForm
  },
  data() {
    return {
      mode: '',
      oobCode: ''
    };
  },
  created() {
    this.mode = getParameterByName('mode');
    this.oobCode = getParameterByName('oobCode');
  }
};
</script>
