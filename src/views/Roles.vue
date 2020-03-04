<template>
  <a-spin :spinning="isProcessing">
    <a-card title="All roles" :bordered="false">
      <a-tag
        v-for="role in listRole"
        :key="role._id"
        color="pink"
        @click="updateRoleClick(role)"
      >
        {{ role.name }}
      </a-tag>
      <a-tag
        @click="showNewRoleDialog"
        style="background: #fff; borderStyle: dashed;"
      >
        <a-icon type="plus" /> New role
      </a-tag>
    </a-card>

    <a-modal
      style="top: 70px;"
      title="Create new role"
      :footer="null"
      :visible="newRoleDialogVisible"
      :maskClosable="false"
      :confirmLoading="isNewRoleCreating"
      @cancel="cancelRoleDialog"
    >
      <a-form @submit="createNewRoleHandle">
        <a-form-item label="Name">
          <a-input v-model="newRole.name" placeholder="Role name"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="newRole.name === ''"
            type="primary"
            html-type="submit"
            block
            >Scoopydoo·\o/</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      style="top: 70px;"
      title="Update role"
      :footer="null"
      :visible="updateRoleDialogVisible"
      :maskClosable="false"
      :confirmLoading="isRoleUpdating"
      @cancel="cancelUpdateRoleDialog"
    >
      <a-form @submit="updateRoleHandle">
        <a-form-item label="New name">
          <a-input
            v-model="updateRole.name"
            placeholder="New role name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="updateRole.name === ''"
            type="primary"
            html-type="submit"
            block
            >Scoopydoo·\o/</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </a-spin>
</template>

<script lang="ts">
/**
 * NOTE: No DELETE method because each role-id will be linked with candidates.
 * So if role-id had deleted, candidates had been failed.
 */

import instance from '@/instance';
import { Component, Vue } from 'vue-property-decorator';

// eslint-disable-next-line
const { Slider } = require('vue-color');

@Component({ components: { Slider } })
export default class Main extends Vue {
  public isProcessing = false;
  public listRole = [];

  public newRoleDialogVisible = false;
  public isNewRoleCreating = false;
  public newRole = {
    name: '',
    color: {}
  };

  public updateRoleDialogVisible = false;
  public isRoleUpdating = false;
  public updateRole = {
    id: '',
    name: '',
    role: {}
  };

  private async getRole() {
    this.isProcessing = true;
    instance
      .get('/roles')
      .then(response => response.data)
      .then(response => (this.listRole = response.data))
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isProcessing = false));
  }

  private async createNewRole(name: string) {
    this.isNewRoleCreating = true;
    instance
      .post('/role/new', { name })
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.$message.success('New role is created');
          this.listRole.unshift(response.data as never);
          this.cancelRoleDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isNewRoleCreating = false));
  }

  private async updateRoleName(process: any, id: string, name: string) {
    this.isRoleUpdating = true;
    instance
      .patch('/role/' + id, { name })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Role is updated');
          process.name = name;
          this.cancelUpdateRoleDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isRoleUpdating = false));
  }

  public createNewRoleHandle(event: Event) {
    event.preventDefault();
    this.createNewRole(this.newRole.name);
  }

  public updateRoleHandle(event: Event) {
    event.preventDefault();
    this.updateRoleName(
      this.updateRole.role,
      this.updateRole.id,
      this.updateRole.name
    );
  }

  public updateRoleClick(role: any) {
    this.updateRole.role = role;
    this.updateRole.name = role.name;
    this.updateRole.id = role._id;
    this.showUpdateRoleDialog();
  }

  public showNewRoleDialog() {
    this.newRoleDialogVisible = true;
  }

  public showUpdateRoleDialog() {
    this.updateRoleDialogVisible = true;
  }

  public cancelRoleDialog() {
    this.newRoleDialogVisible = false;
  }

  public cancelUpdateRoleDialog() {
    this.updateRoleDialogVisible = false;
  }

  private mounted() {
    this.getRole();
  }
}
</script>
