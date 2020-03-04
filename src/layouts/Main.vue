<template>
  <a-layout id="main" :style="{ minHeight: '100vh' }">
    <a-layout-sider
      v-if="!$route.meta.hideLayout"
      :trigger="null"
      collapsible
      v-model="collapsed"
      style="box-shadow: 2px 0 6px rgba(0,21,41,.35);"
    >
      <div class="logo">
        <a href="/">
          <h1>{{ collapsed ? 'SBD' : 'Scoobydoo' }}</h1>
        </a>
      </div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[$route.path]">
        <a-menu-item key="/">
          <router-link to="/">
            <a-icon type="home" />
            <span>Home</span>
          </router-link>
        </a-menu-item>

        <a-sub-menu key="/settings">
          <span slot="title">
            <a-icon type="setting" />
            <span>Settings</span>
          </span>
          <a-menu-item key="/processes">
            <router-link to="/processes">
              <a-icon type="team" />
              <span>Processes</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/roles">
            <router-link to="/roles">
              <a-icon type="idcard" />
              <span>Roles</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/sources">
            <router-link to="/sources">
              <a-icon type="global" />
              <span>Sources</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/statuses">
            <router-link to="/statuses">
              <a-icon type="file-sync" />
              <span>Statuses</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/types">
            <router-link to="/types">
              <a-icon type="user" />
              <span>Types</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="/accounts">
          <span slot="title">
            <a-icon type="team" />
            <span>Accounts</span>
          </span>
          <a-menu-item key="/new-account">
            <router-link to="/new-account">
              <a-icon type="user-add" />
              <span>New</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/change-password">
            <router-link to="/change-password">
              <a-icon type="lock" />
              <span>Password</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header
        v-if="!$route.meta.hideLayout"
        style="background: #fff; padding: 0; box-shadow: 0 1px 4px rgba(0,21,41,.08);"
      >
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <a class="user-link" @click="logout">
          <a-icon type="logout" />&nbsp;Logout
        </a>
        <a class="user-link" disabled>
          <a-icon type="user" /> {{ passport.fullName }}
        </a>
      </a-layout-header>

      <a-layout-content :style="{ padding: '24px' }">
        <router-view />
      </a-layout-content>

      <a-layout-footer style="text-align: center"
        >Scoobydoo ©2020 by RK Nguyen.</a-layout-footer
      >
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  computed: mapState({
    passport: (state: any) => state.passport
  })
})
export default class Main extends Vue {
  public collapsed = false;

  public logout() {
    window.localStorage.removeItem('signed_token');
    this.$router.push({ path: '/login' });
  }
}
</script>

<style>
.ant-menu-item:first-child {
  margin-top: 0 !important;
}

#main .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#main .trigger:hover {
  color: #1890ff;
}

a.user-link {
  color: rgba(0, 0, 0, 0.65) !important;
  text-decoration: none !important;
  float: right;
  padding-right: 24px;
  transition: color 0.3s;
}

a.user-link:hover {
  color: #1890ff !important;
}

#main .logo {
  position: relative;
  height: 64px;
  padding-left: 24px;
  overflow: hidden;
  line-height: 64px;
  background: #002140;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

#main .logo h1 {
  display: inline-block;
  color: #fff;
  font-size: 20px;
  margin: 0 0 0 0px;
  font-weight: 600;
  vertical-align: middle;
}
</style>
