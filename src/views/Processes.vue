<template>
  <a-spin :spinning="isProcessing">
    <a-card title="All processes" :bordered="false">
      <a-tag
        v-for="process in listProcess"
        :key="process._id"
        :color="process.color || null"
        @click="updateProcessClick(process)"
      >
        {{ process.name }}
      </a-tag>
      <a-tag
        @click="showNewProcessDialog"
        style="background: #fff; borderStyle: dashed;"
      >
        <a-icon type="plus" /> New process
      </a-tag>
    </a-card>

    <a-modal
      style="top: 70px;"
      title="Create new process"
      :footer="null"
      :visible="newProcessDialogVisible"
      :maskClosable="false"
      :confirmLoading="isNewProcessCreating"
      @cancel="cancelProcessDialog"
    >
      <a-form @submit="createNewProcessHandle">
        <a-form-item label="Name">
          <a-input
            v-model="newProcess.name"
            placeholder="Process name"
          ></a-input>
        </a-form-item>
        <a-form-item label="Color">
          <Slider v-model="newProcess.color"></Slider>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="newProcess.name === ''"
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
      title="Update process"
      :footer="null"
      :visible="updateProcessDialogVisible"
      :maskClosable="false"
      :confirmLoading="isProcessUpdating"
      @cancel="cancelUpdateProcessDialog"
    >
      <a-form @submit="updateProcessHandle">
        <a-form-item label="New name">
          <a-input
            v-model="updateProcess.name"
            placeholder="New process name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="updateProcess.name === ''"
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
  public listProcess = [];

  public newProcessDialogVisible = false;
  public isNewProcessCreating = false;
  public newProcess = {
    name: '',
    color: {}
  };

  public updateProcessDialogVisible = false;
  public isProcessUpdating = false;
  public updateProcess = {
    id: '',
    name: '',
    process: {}
  };

  private async getProcess() {
    this.isProcessing = true;
    instance
      .get('/processes')
      .then(response => response.data)
      .then(response => (this.listProcess = response.data))
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isProcessing = false));
  }

  private async createNewProcess(name: string, color: string) {
    this.isNewProcessCreating = true;
    instance
      .post('/process/new', { name, color })
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.$message.success('New process is created');
          this.listProcess.unshift(response.data as never);
          this.cancelProcessDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isNewProcessCreating = false));
  }

  private async updateProcessName(process: any, id: string, name: string) {
    this.isProcessUpdating = true;
    instance
      .patch('/process/' + id, { name })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Process is updated');
          process.name = name;
          this.cancelUpdateProcessDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isProcessUpdating = false));
  }

  public createNewProcessHandle(event: Event) {
    event.preventDefault();
    this.createNewProcess(
      this.newProcess.name,
      (this.newProcess.color as any).hex
    );
  }

  public updateProcessHandle(event: Event) {
    event.preventDefault();
    this.updateProcessName(
      this.updateProcess.process,
      this.updateProcess.id,
      this.updateProcess.name
    );
  }

  public updateProcessClick(process: any) {
    this.updateProcess.process = process;
    this.updateProcess.name = process.name;
    this.updateProcess.id = process._id;
    this.showUpdateProcessDialog();
  }

  public showNewProcessDialog() {
    this.newProcessDialogVisible = true;
  }

  public showUpdateProcessDialog() {
    this.updateProcessDialogVisible = true;
  }

  public cancelProcessDialog() {
    this.newProcessDialogVisible = false;
  }

  public cancelUpdateProcessDialog() {
    this.updateProcessDialogVisible = false;
  }

  private mounted() {
    this.getProcess();
  }
}
</script>
