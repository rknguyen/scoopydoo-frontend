<template>
  <a-spin :spinning="isFormLoading" tip="Waiting for changing your password">
    <a-card title="Change password" :bordered="false">
      <a-row>
        <a-col :span="10">
          <a-form @submit="handleSubmit">
            <a-form-item label="New password">
              <a-input-password
                v-model="password"
                placeholder="Your new password"
              ></a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button
                style="float:right;"
                :disabled="password === ''"
                type="primary"
                html-type="submit"
                >Change password</a-button
              >
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </a-spin>
</template>

<script lang="ts">
import instance from '@/instance';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Main extends Vue {
  public isFormLoading = false;
  public password = '';

  public handleSubmit(event: Event) {
    event.preventDefault();
    this.isFormLoading = true;
    instance
      .patch('/user/me/password', { password: this.password })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.password = '';
          this.$message.success('Your password is changed');
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isFormLoading = false));
  }
}
</script>
