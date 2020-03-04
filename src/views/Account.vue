<template>
  <a-spin :spinning="isFormLoading" tip="Waiting for adding new account">
    <a-card title="Add account" :bordered="false">
      <a-row>
        <a-col :span="10">
          <a-form @submit="handleSubmit">
            <a-form-item label="Full name">
              <a-input
                v-model="fullname"
                placeholder="Last name and first name"
              ></a-input>
            </a-form-item>
            <a-form-item label="Username">
              <a-input
                v-model="username"
                placeholder="Scoopydooooooo~~~"
              ></a-input>
            </a-form-item>
            <a-form-item label="Password">
              <a-input-password
                v-model="password"
                placeholder="Password"
              ></a-input-password>
            </a-form-item>
            <a-form-item>
              <a-button
                style="float:right;"
                :disabled="
                  fullname === '' || username === '' || password === ''
                "
                type="primary"
                html-type="submit"
                ><a-icon type="plus-square" /> Add this user</a-button
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
  public fullname = '';
  public username = '';
  public password = '';

  public handleSubmit(event: Event) {
    event.preventDefault();
    this.isFormLoading = true;
    const { fullname: fullName, username, password } = this;
    instance
      .post('/user/new', { fullName, username, password })
      .then(response => response.data)
      .then(response => {
        if (response.username) {
          this.password = '';
          this.username = '';
          this.fullname = '';
          this.$message.success('Account is created');
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
