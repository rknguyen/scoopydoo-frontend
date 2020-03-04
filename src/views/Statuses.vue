<template>
  <a-spin :spinning="isProcessing">
    <a-card title="All statuses" :bordered="false">
      <a-tag
        v-for="status in listStatuses"
        :key="status._id"
        :color="status.color || null"
        @click="updateStatusClick(status)"
      >
        {{ status.name }}
      </a-tag>
      <a-tag
        @click="showNewStatusDialog"
        style="background: #fff; borderStyle: dashed;"
      >
        <a-icon type="plus" /> New status
      </a-tag>
    </a-card>

    <a-modal
      style="top: 70px;"
      title="Create new status"
      :footer="null"
      :visible="newStatusDialogVisible"
      :maskClosable="false"
      :confirmLoading="isNewStatusCreating"
      @cancel="cancelStatusDialog"
    >
      <a-form @submit="createNewStatusHandle">
        <a-form-item label="Name">
          <a-input v-model="newStatus.name" placeholder="Status name"></a-input>
        </a-form-item>
        <a-form-item label="Color">
          <Slider v-model="newStatus.color"></Slider>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="newStatus.name === ''"
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
      title="Update status"
      :footer="null"
      :visible="updateStatusDialogVisible"
      :maskClosable="false"
      :confirmLoading="isStatusUpdating"
      @cancel="cancelUpdateStatusDialog"
    >
      <a-form @submit="updateStatusHandle">
        <a-form-item label="New name">
          <a-input
            v-model="updateStatus.name"
            placeholder="New status name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="updateStatus.name === ''"
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
 * NOTE: No DELETE method because each process-id will be linked with candidates.
 * So if process-id had deleted, candidates had been failed.
 */

import instance from '@/instance';
import { Component, Vue } from 'vue-property-decorator';

// eslint-disable-next-line
const { Slider } = require('vue-color');

@Component({ components: { Slider } })
export default class Main extends Vue {
  public isProcessing = false;
  public listStatuses = [];

  public newStatusDialogVisible = false;
  public isNewStatusCreating = false;
  public newStatus = {
    name: '',
    color: {}
  };

  public updateStatusDialogVisible = false;
  public isStatusUpdating = false;
  public updateStatus = {
    id: '',
    name: '',
    status: {}
  };

  private async getStatus() {
    this.isProcessing = true;
    instance
      .get('/statuses')
      .then(response => response.data)
      .then(response => (this.listStatuses = response.data))
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isProcessing = false));
  }

  private async createNewStatus(name: string, color: string) {
    this.isNewStatusCreating = true;
    instance
      .post('/status/new', { name, color })
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.$message.success('New status is created');
          this.listStatuses.unshift(response.data as never);
          this.cancelStatusDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isNewStatusCreating = false));
  }

  private async updateStatusName(status: any, id: string, name: string) {
    this.isStatusUpdating = true;
    instance
      .patch('/status/' + id, { name })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Status is updated');
          status.name = name;
          this.cancelUpdateStatusDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isStatusUpdating = false));
  }

  public createNewStatusHandle(event: Event) {
    event.preventDefault();
    this.createNewStatus(
      this.newStatus.name,
      (this.newStatus.color as any).hex
    );
  }

  public updateStatusHandle(event: Event) {
    event.preventDefault();
    this.updateStatusName(
      this.updateStatus.status,
      this.updateStatus.id,
      this.updateStatus.name
    );
  }

  public updateStatusClick(status: any) {
    this.updateStatus.status = status;
    this.updateStatus.name = status.name;
    this.updateStatus.id = status._id;
    this.showUpdateStatusDialog();
  }

  public showNewStatusDialog() {
    this.newStatusDialogVisible = true;
  }

  public showUpdateStatusDialog() {
    this.updateStatusDialogVisible = true;
  }

  public cancelStatusDialog() {
    this.newStatusDialogVisible = false;
  }

  public cancelUpdateStatusDialog() {
    this.updateStatusDialogVisible = false;
  }

  private mounted() {
    this.getStatus();
  }
}
</script>
