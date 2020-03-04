<template>
  <a-spin
    :spinning="isFormLoading"
    tip="Waiting for authenticate your credentials"
  >
    <div class="full-height">
      <a-row class="pd-30">
        <a-col :span="8" :offset="8">
          <img class="login-icon" src="login.svg" />
          <h1 class="heading">SCOOPYDOO</h1>

          <a-form @submit="handleSubmit">
            <a-form-item>
              <a-input size="large" v-model="username" placeholder="Username">
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input-password
                size="large"
                v-model="password"
                placeholder="Password"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-button size="large" type="primary" html-type="submit" block
                >Login</a-button
              >
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>

      <a-layout-footer style="text-align: center"
        >Scoobydoo ©2020 by RK Nguyen.</a-layout-footer
      >
    </div>
  </a-spin>
</template>

<script lang="ts">
import instance from '@/instance';
import { Component, Vue } from 'vue-property-decorator';
import Store from '../store';

@Component
export default class HelloWorld extends Vue {
  public username = '';
  public password = '';
  public isFormLoading = false;

  private async login(username: string, password: string): Promise<void> {
    return instance
      .post('/auth/sign-in', { username, password })
      .then(response => response.data)
      .then(response => {
        if (response.error) {
          this.$message.error(response.error);
        } else {
          const { signed_token: signedToken } = response;
          localStorage.setItem('signed_token', signedToken);
          this.$message.success('Login successfully [o]..[o]');
          this.$router.push({ path: '/' });
        }
      })
      .catch(error => {
        console.log(error);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isFormLoading = false));
  }

  public handleSubmit(event: Event) {
    event.preventDefault();
    this.isFormLoading = true;
    setTimeout(() => this.login(this.username, this.password), 1000);
  }

  private beforeCreate() {
    const { passport } = Store.getters;
    if (passport.logined) {
      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>
.pd-30 {
  padding-top: 30px;
}

.login-icon {
  display: block;
  width: 150px;

  margin: auto;
  margin-bottom: 30px;
}

.heading {
  color: #1890ff;
  text-align: center;
  -webkit-text-stroke: 4px #1890ff;
}
</style>
