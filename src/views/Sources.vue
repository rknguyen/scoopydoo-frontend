<template>
  <a-spin :spinning="isProcessing">
    <a-card title="All sources" :bordered="false">
      <a-tag
        v-for="source in listSources"
        :key="source._id"
        :color="source.color || null"
        @click="updateSourceClick(source)"
      >
        {{ source.name }}
      </a-tag>
      <a-tag
        @click="showNewSourceDialog"
        style="background: #fff; borderStyle: dashed;"
      >
        <a-icon type="plus" /> New source
      </a-tag>
    </a-card>

    <a-modal
      style="top: 70px;"
      title="Create new source"
      :footer="null"
      :visible="newSourceDialogVisible"
      :maskClosable="false"
      :confirmLoading="isNewSourceCreating"
      @cancel="cancelSourceDialog"
    >
      <a-form @submit="createNewSourceHandle">
        <a-form-item label="Name">
          <a-input v-model="newSource.name" placeholder="Source name"></a-input>
        </a-form-item>
        <a-form-item label="Color">
          <Slider v-model="newSource.color"></Slider>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="newSource.name === ''"
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
      title="Update source"
      :footer="null"
      :visible="updateSourceDialogVisible"
      :maskClosable="false"
      :confirmLoading="isSourceUpdating"
      @cancel="cancelUpdateSourceDialog"
    >
      <a-form @submit="updateSourceHandle">
        <a-form-item label="New name">
          <a-input
            v-model="updateSource.name"
            placeholder="New source name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :disabled="updateSource.name === ''"
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
  public listSources = [];

  public newSourceDialogVisible = false;
  public isNewSourceCreating = false;
  public newSource = {
    name: '',
    color: {}
  };

  public updateSourceDialogVisible = false;
  public isSourceUpdating = false;
  public updateSource = {
    id: '',
    name: '',
    source: {}
  };

  private async getSource() {
    this.isProcessing = true;
    instance
      .get('/sources')
      .then(response => response.data)
      .then(response => (this.listSources = response.data))
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isProcessing = false));
  }

  private async createNewSource(name: string, color: string) {
    this.isNewSourceCreating = true;
    instance
      .post('/source/new', { name, color })
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.$message.success('New source is created');
          this.listSources.unshift(response.data as never);
          this.cancelSourceDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isNewSourceCreating = false));
  }

  private async updateSourceName(source: any, id: string, name: string) {
    this.isSourceUpdating = true;
    instance
      .patch('/source/' + id, { name })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Source is updated');
          source.name = name;
          this.cancelUpdateSourceDialog();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isSourceUpdating = false));
  }

  public createNewSourceHandle(event: Event) {
    event.preventDefault();
    this.createNewSource(
      this.newSource.name,
      (this.newSource.color as any).hex
    );
  }

  public updateSourceHandle(event: Event) {
    event.preventDefault();
    this.updateSourceName(
      this.updateSource.source,
      this.updateSource.id,
      this.updateSource.name
    );
  }

  public updateSourceClick(source: any) {
    this.updateSource.source = source;
    this.updateSource.name = source.name;
    this.updateSource.id = source._id;
    this.showUpdateSourceDialog();
  }

  public showNewSourceDialog() {
    this.newSourceDialogVisible = true;
  }

  public showUpdateSourceDialog() {
    this.updateSourceDialogVisible = true;
  }

  public cancelSourceDialog() {
    this.newSourceDialogVisible = false;
  }

  public cancelUpdateSourceDialog() {
    this.updateSourceDialogVisible = false;
  }

  private mounted() {
    this.getSource();
  }
}
</script>
