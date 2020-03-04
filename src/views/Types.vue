<template>
  <a-spin :spinning="isProcessing">
    <a-card title="All types" :bordered="false">
      <a-tag
        v-for="type in listTypes"
        :key="type._id"
        :color="type.color || null"
        @click="updateTypeClick(type)"
      >
        {{ type.name }}
      </a-tag>
      <a-tag
        @click="showNewTypeDialog"
        style="background: #fff; borderStyle: dashed;"
      >
        <a-icon type="plus" /> New type
      </a-tag>
    </a-card>

    <a-modal
      style="top: 70px;"
      title="Create new type"
      :footer="null"
      :visible="newTypeDialogVisible"
      :maskClosable="false"
      :confirmLoading="isNewTypeCreating"
      @cancel="cancelTypeDialog"
    >
      <a-form @submit="createNewTypeHandle">
        <a-form-item label="Name">
          <a-input v-model="newType.name" placeholder="Type name"></a-input>
        </a-form-item>
        <a-form-item label="Color">
          <Slider v-model="newType.color"></Slider>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="newType.name === ''"
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
      title="Update type"
      :footer="null"
      :visible="updateTypeDialogVisible"
      :maskClosable="false"
      :confirmLoading="isTypeUpdating"
      @cancel="cancelUpdateTypeDialog"
    >
      <a-form @submit="updateTypeHandle">
        <a-form-item label="New name">
          <a-input
            v-model="updateType.name"
            placeholder="New type name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="updateType.name === ''"
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
  public listTypes = [];

  public newTypeDialogVisible = false;
  public isNewTypeCreating = false;
  public newType = {
    name: '',
    color: {}
  };

  public updateTypeDialogVisible = false;
  public isTypeUpdating = false;
  public updateType = {
    id: '',
    name: '',
    type: {}
  };

  private async getType() {
    this.isProcessing = true;
    instance
      .get('/types')
      .then(response => response.data)
      .then(response => (this.listTypes = response.data))
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isProcessing = false));
  }

  private async createNewType(name: string, color: string) {
    this.isNewTypeCreating = true;
    instance
      .post('/type/new', { name, color })
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.$message.success('New type is created');
          this.listTypes.unshift(response.data as never);
          this.cancelTypeDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isNewTypeCreating = false));
  }

  private async updateTypeName(type: any, id: string, name: string) {
    this.isTypeUpdating = true;
    instance
      .patch('/type/' + id, { name })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Type is updated');
          type.name = name;
          this.cancelUpdateTypeDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isTypeUpdating = false));
  }

  public createNewTypeHandle(event: Event) {
    event.preventDefault();
    this.createNewType(this.newType.name, (this.newType.color as any).hex);
  }

  public updateTypeHandle(event: Event) {
    event.preventDefault();
    this.updateTypeName(
      this.updateType.type,
      this.updateType.id,
      this.updateType.name
    );
  }

  public updateTypeClick(type: any) {
    this.updateType.type = type;
    this.updateType.name = type.name;
    this.updateType.id = type._id;
    this.showUpdateTypeDialog();
  }

  public showNewTypeDialog() {
    this.newTypeDialogVisible = true;
  }

  public showUpdateTypeDialog() {
    this.updateTypeDialogVisible = true;
  }

  public cancelTypeDialog() {
    this.newTypeDialogVisible = false;
  }

  public cancelUpdateTypeDialog() {
    this.updateTypeDialogVisible = false;
  }

  private mounted() {
    this.getType();
  }
}
</script>
