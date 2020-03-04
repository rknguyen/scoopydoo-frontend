<template>
  <a-spin :spinning="isProcessing">
    <a-row :gutter="32">
      <a-col :span="12" :order="1">
        <a-card>
          <h1 class="candidate-name">
            {{ candidate.name }}
            <a-icon
              @click="onClickDeleteCandidate"
              class="remover"
              type="close"
            />
          </h1>
          <h4>
            <a :href="'mailto:' + candidate.email">{{ candidate.email }}</a>
          </h4>

          <!-- STATUS MANAGEMENT -->
          <div>
            <a-divider orientation="left" dashed>
              <h6>Status</h6>
            </a-divider>

            <!-- PROCESS -->
            <div id="process">
              <a-row>
                <a-col :span="12">
                  <h3>Process</h3>
                </a-col>
                <a-col :span="12">
                  <a-tag
                    @click="updateProcessClick"
                    v-if="candidate.process"
                    :color="candidate.process.color"
                    >{{ candidate.process.name }}</a-tag
                  >
                  <a-tag @click="updateProcessClick" v-else>Unprovided</a-tag>
                </a-col>
              </a-row>
            </div>

            <!-- STATUS -->
            <div id="status">
              <a-row>
                <a-col :span="12">
                  <h3>Status</h3>
                </a-col>
                <a-col :span="12">
                  <a-tag
                    @click="updateStatusClick"
                    v-if="candidate.status"
                    :color="candidate.status.color"
                    >{{ candidate.status.name }}</a-tag
                  >
                  <a-tag @click="updateStatusClick" v-else>Unprovided</a-tag>
                </a-col>
              </a-row>
            </div>
          </div>

          <!-- INFORMATION MANAGEMENT -->
          <div>
            <a-divider orientation="left" dashed>
              <h6>Information</h6>
            </a-divider>

            <!-- BTS -->
            <div id="bts">
              <a-row>
                <a-col :span="12">
                  <h3>BTS</h3>
                </a-col>
                <a-col :span="12">
                  <div class="editor-area">
                    <span v-if="candidate.BTSId">{{ candidate.BTSId }}</span>
                    <span v-else>Not provided</span>
                    <span @click="onClickEditBTS(candidate)" class="editor-pen">
                      <a-icon type="edit" />
                    </span>
                  </div>
                </a-col>
              </a-row>
            </div>

            <!-- SCHEDULE -->
            <div id="role">
              <a-row>
                <a-col :span="12">
                  <h3>Schedule</h3>
                </a-col>
                <a-col :span="12">
                  <div class="editor-area">
                    <span v-if="candidate.scheduledTime">{{
                      moment(candidate.scheduledTime).format(
                        'DD/MM/YYYY HH:mm:ss'
                      )
                    }}</span>
                    <span v-else>Not scheduled</span>
                    <span
                      @click="onClickEditSchedule(candidate)"
                      class="editor-pen"
                    >
                      <a-icon type="edit" />
                    </span>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>

          <!-- ROLE MANAGEMENT -->
          <div>
            <a-divider orientation="left" dashed>
              <h6>Extra information</h6>
            </a-divider>

            <!-- ROLE -->
            <div id="role">
              <a-row>
                <a-col :span="12">
                  <h3>Role</h3>
                </a-col>
                <a-col :span="12">
                  <a-tag
                    v-if="candidate.role"
                    color="pink"
                    @click="updateRoleClick"
                    >{{ candidate.role.name }}</a-tag
                  >
                  <a-tag @click="updateRoleClick" v-else>Unprovided</a-tag>
                </a-col>
              </a-row>
            </div>

            <!-- TYPE -->
            <div id="type">
              <a-row>
                <a-col :span="12">
                  <h3>Type</h3>
                </a-col>
                <a-col :span="12">
                  <a-tag
                    v-if="candidate.type"
                    :color="candidate.type.color"
                    @click="updateTypeClick"
                    >{{ candidate.type.name }}</a-tag
                  >
                  <a-tag @click="updateTypeClick" v-else>Unprovided</a-tag>
                </a-col>
              </a-row>
            </div>

            <!-- SOURCE -->
            <div id="type">
              <a-row>
                <a-col :span="12">
                  <h3>Source</h3>
                </a-col>
                <a-col :span="12">
                  <a-tag
                    v-if="candidate.source"
                    :color="candidate.source.color"
                    @click="updateSourceClick"
                    >{{ candidate.source.name }}</a-tag
                  >
                  <a-tag @click="updateSourceClick" v-else>Unprovided</a-tag>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12" :order="2">
        <a-card title="History">
          <div class="history-list">
            <a-timeline>
              <a-timeline-item
                v-for="action in candidate.history"
                :key="action._id"
              >
                <h4>
                  {{ action.actor.fullName }}
                  <small>{{ moment(action.createdAt).fromNow() }}</small>
                </h4>
                <h6>
                  <i>{{ ACTION_TYPE_TO_MSG[action.actionType] }}</i>
                </h6>
                <h5>{{ action.comment }}</h5>
              </a-timeline-item>
              <a-timeline-item>
                <small>{{ moment(candidate.createdAt).fromNow() }}</small>
                <h4>Created candidate profile</h4>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- UPDATE PROCESS -->
    <a-drawer
      title="Update new process"
      :width="500"
      :visible="updateProcessVisible"
      @close="updateProcessClose"
    >
      <a-spin :spinning="processLoading">
        <a-form @submit="updateProcessHandle">
          <a-form-item label="Process">
            <a-select v-model="updateProcessId">
              <a-select-option
                v-for="process in processList"
                :key="process._id"
                :value="process._id"
                >{{ process.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateProcessComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="!updateProcessId || updateProcessComment === ''"
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>

    <!-- UPDATE STATUS -->
    <a-drawer
      title="Update new status"
      :width="500"
      :visible="updateStatusVisible"
      @close="updateStatusClose"
    >
      <a-spin :spinning="statusLoading">
        <a-form @submit="updateStatusHandle">
          <a-form-item label="Status">
            <a-select v-model="updateStatusId">
              <a-select-option
                v-for="status in statusList"
                :key="status._id"
                :value="status._id"
                >{{ status.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateStatusComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="!updateStatusId || updateStatusComment === ''"
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>

    <!-- UPDATE ROLE -->
    <a-drawer
      title="Update new role"
      :width="500"
      :visible="updateRoleVisible"
      @close="updateRoleClose"
    >
      <a-spin :spinning="roleLoading">
        <a-form @submit="updateRoleHandle">
          <a-form-item label="Role">
            <a-select v-model="updateRoleId">
              <a-select-option
                v-for="role in roleList"
                :key="role._id"
                :value="role._id"
                >{{ role.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateRoleComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="!updateRoleId || updateRoleComment === ''"
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>

    <!-- UPDATE TYPE -->
    <a-drawer
      title="Update new type"
      :width="500"
      :visible="updateTypeVisible"
      @close="updateTypeClose"
    >
      <a-spin :spinning="typeLoading">
        <a-form @submit="updateTypeHandle">
          <a-form-item label="Type">
            <a-select v-model="updateTypeId">
              <a-select-option
                v-for="type in typeList"
                :key="type._id"
                :value="type._id"
                >{{ type.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateTypeComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="!updateTypeId || updateTypeComment === ''"
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>

    <!-- UPDATE SOURCE -->
    <a-drawer
      title="Update new source"
      :width="500"
      :visible="updateSourceVisible"
      @close="updateSourceClose"
    >
      <a-spin :spinning="sourceLoading">
        <a-form @submit="updateSourceHandle">
          <a-form-item label="Source">
            <a-select v-model="updateSourceId">
              <a-select-option
                v-for="source in sourceList"
                :key="source._id"
                :value="source._id"
                >{{ source.name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateSourceComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="!updateSourceId || updateSourceComment === ''"
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>

    <!-- UPDATE BTS -->
    <a-drawer
      title="Update new BTS"
      :width="500"
      :visible="updateBTSVisible"
      @close="updateBTSVisible = false"
    >
      <a-spin :spinning="updateBTSLoading">
        <a-form @submit="updateBTSHandle">
          <a-form-item label="New BTS ID">
            <a-input v-model="updateBTSId" placeholder="New BTS ID here" />
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateBTSComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="updateBTSId === '' || updateBTSComment === ''"
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>

    <!-- UPDATE SCHEDULE -->
    <a-drawer
      title="Update new schedule"
      :width="500"
      :visible="updateScheduleVisible"
      @close="updateScheduleVisible = false"
    >
      <a-spin :spinning="updateScheduleLoading">
        <a-form @submit="updateScheduleHandle">
          <a-form-item label="New schedule">
            <a-date-picker
              v-model="updateScheduledTime"
              format="DD/MM/YYYY HH:mm:ss"
              :showTime="true"
              :style="{ width: '100%' }"
            />
          </a-form-item>
          <a-form-item label="Note">
            <a-textarea
              v-model="updateScheduleComment"
              placeholder="Leave the note here"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              :disabled="
                updateScheduledTime === '' || updateScheduleComment === ''
              "
              type="primary"
              html-type="submit"
              block
              >Update</a-button
            >
          </a-form-item>
        </a-form>
      </a-spin>
    </a-drawer>
  </a-spin>
</template>

<style scoped>
.remover {
  opacity: 0;
  cursor: pointer;
  font-size: 8px;

  /**
    (X) is setted vertical-align: middle
    so if use padding it will be not in middle
    -> margin-top is minus of padding size will fixed
   */
  padding: 5px;
  margin-top: -5px;
  vertical-align: middle;

  border-style: solid;
  border-width: 1px;
  border-color: #d9d9d9;
  border-radius: 50%;

  -webkit-transition: all 200ms ease-in-out;
  -moz-transition: all 200ms ease-in-out;
  -ms-transition: all 200ms ease-in-out;
  -o-transition: all 200ms ease-in-out;
  transition: all 200ms ease-in-out;
}

.candidate-name:hover .remover {
  opacity: 1;
}

.editor-pen {
  opacity: 0;
  margin: 5px;
  cursor: pointer;

  -webkit-transition: all 200ms ease-in-out;
  -moz-transition: all 200ms ease-in-out;
  -ms-transition: all 200ms ease-in-out;
  -o-transition: all 200ms ease-in-out;
  transition: all 200ms ease-in-out;
}

.editor-pen:hover,
.editor-area:hover .editor-pen {
  opacity: 1;
}

.history-list {
  overflow-y: auto;
  max-height: 500px;
}
</style>

<script lang="ts">
import instance from '@/instance';
import { Component, Vue } from 'vue-property-decorator';

import moment from 'moment';

@Component({ methods: { moment } })
export default class Main extends Vue {
  public ACTION_TYPE_TO_MSG = {
    UPDATE_PROCESS: 'Update to new process',
    UPDATE_STATUS: 'Update to new status',
    UPDATE_ROLE: 'Update to new role',
    UPDATE_TYPE: 'Update to new type',
    UPDATE_SOURCE: 'Update to new source',
    UPDATE_BTSID: 'Update to new BTS ID',
    UPDATE_SCHEDULE: 'Update to new schedule'
  };

  public isProcessing = false;
  public candidate = {};

  private async getCandidate() {
    this.isProcessing = true;
    instance
      .get('/candidate/' + this.$route.params.id)
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.candidate = response.data;
        } else {
          this.$message.error(response.error || response);
          this.$router.push({ path: '/' });
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
        this.$router.push({ path: '/' });
      })
      .finally(() => (this.isProcessing = false));
  }

  /**
   * UPDATE PROCESS
   */
  public updateProcessVisible = false;
  public updateProcessClick() {
    this.loadProcess();
    this.updateProcessVisible = true;
  }
  public updateProcessClose() {
    this.updateProcessVisible = false;
  }

  public processList = [];
  public updateProcessId = null;
  public updateProcessComment = '';
  public processLoading = false;
  public async loadProcess() {
    this.processLoading = true;
    instance
      .get('/processes')
      .then(response => response.data)
      .then(response => (this.processList = response.data))
      .catch(errors => {
        console.log(errors);
        this.updateProcessClose();
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.processLoading = false));
  }

  public updateProcess(candidateId: string, processId: any, comment: string) {
    this.processLoading = true;
    instance
      .patch('/candidate/' + candidateId + '/process', { processId, comment })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate process is updated');
          this.updateProcessClose();
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.processLoading = false));
  }

  public updateProcessHandle(event: Event) {
    event.preventDefault();
    const candidateId = (this.candidate as any)._id;
    const processId = this.updateProcessId;
    const comment = this.updateProcessComment;
    this.updateProcess(candidateId, processId, comment);
  }

  /**
   * UPDATE ROLE
   */
  public updateRoleVisible = false;
  public updateRoleClick() {
    this.loadRole();
    this.updateRoleVisible = true;
  }
  public updateRoleClose() {
    this.updateRoleVisible = false;
  }

  public roleList = [];
  public updateRoleId = null;
  public updateRoleComment = '';
  public roleLoading = false;
  public async loadRole() {
    this.roleLoading = true;
    instance
      .get('/roles')
      .then(response => response.data)
      .then(response => (this.roleList = response.data))
      .catch(errors => {
        console.log(errors);
        this.updateRoleClose();
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.roleLoading = false));
  }

  public updateRole(candidateId: string, roleId: any, comment: string) {
    this.roleLoading = true;
    instance
      .patch('/candidate/' + candidateId + '/role', { roleId, comment })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate role is updated');
          this.updateRoleClose();
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.roleLoading = false));
  }

  public updateRoleHandle(event: Event) {
    event.preventDefault();
    const candidateId = (this.candidate as any)._id;
    const roleId = this.updateRoleId;
    const comment = this.updateRoleComment;
    this.updateRole(candidateId, roleId, comment);
  }

  /**
   * UPDATE TYPE
   */
  public updateTypeVisible = false;
  public updateTypeClick() {
    this.loadType();
    this.updateTypeVisible = true;
  }
  public updateTypeClose() {
    this.updateTypeVisible = false;
  }

  public typeList = [];
  public updateTypeId = null;
  public updateTypeComment = '';
  public typeLoading = false;
  public async loadType() {
    this.typeLoading = true;
    instance
      .get('/types')
      .then(response => response.data)
      .then(response => (this.typeList = response.data))
      .catch(errors => {
        console.log(errors);
        this.updateTypeClose();
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.typeLoading = false));
  }

  public updateType(candidateId: string, typeId: any, comment: string) {
    this.typeLoading = true;
    instance
      .patch('/candidate/' + candidateId + '/type', { typeId, comment })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate type is updated');
          this.updateTypeClose();
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.typeLoading = false));
  }

  public updateTypeHandle(event: Event) {
    event.preventDefault();
    const candidateId = (this.candidate as any)._id;
    const typeId = this.updateTypeId;
    const comment = this.updateTypeComment;
    this.updateType(candidateId, typeId, comment);
  }

  /**
   * UPDATE STATUS
   */
  public updateStatusVisible = false;
  public updateStatusClick() {
    this.loadStatus();
    this.updateStatusVisible = true;
  }
  public updateStatusClose() {
    this.updateStatusVisible = false;
  }

  public statusList = [];
  public updateStatusId = null;
  public updateStatusComment = '';
  public statusLoading = false;
  public async loadStatus() {
    this.statusLoading = true;
    instance
      .get('/statuses')
      .then(response => response.data)
      .then(response => (this.statusList = response.data))
      .catch(errors => {
        console.log(errors);
        this.updateStatusClose();
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.statusLoading = false));
  }

  public updateStatus(candidateId: string, statusId: any, comment: string) {
    this.statusLoading = true;
    instance
      .patch('/candidate/' + candidateId + '/status', { statusId, comment })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate status is updated');
          this.updateStatusClose();
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.statusLoading = false));
  }

  public updateStatusHandle(event: Event) {
    event.preventDefault();
    const candidateId = (this.candidate as any)._id;
    const statusId = this.updateStatusId;
    const comment = this.updateStatusComment;
    this.updateStatus(candidateId, statusId, comment);
  }

  /**
   * UPDATE SOURCE
   */
  public updateSourceVisible = false;
  public updateSourceClick() {
    this.loadSource();
    this.updateSourceVisible = true;
  }
  public updateSourceClose() {
    this.updateSourceVisible = false;
  }

  public sourceList = [];
  public updateSourceId = null;
  public updateSourceComment = '';
  public sourceLoading = false;
  public async loadSource() {
    this.sourceLoading = true;
    instance
      .get('/sources')
      .then(response => response.data)
      .then(response => (this.sourceList = response.data))
      .catch(errors => {
        console.log(errors);
        this.updateSourceClose();
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.sourceLoading = false));
  }

  public updateSource(candidateId: string, sourceId: any, comment: string) {
    this.sourceLoading = true;
    instance
      .patch('/candidate/' + candidateId + '/source', { sourceId, comment })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate source is updated');
          this.updateSourceClose();
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.sourceLoading = false));
  }

  public updateSourceHandle(event: Event) {
    event.preventDefault();
    const candidateId = (this.candidate as any)._id;
    const sourceId = this.updateSourceId;
    const comment = this.updateSourceComment;
    this.updateSource(candidateId, sourceId, comment);
  }

  /**
   * EDIT BTS ID
   */
  public updateBTSVisible = false;
  public updateBTSLoading = false;

  public updateBTSId = '';
  public updateBTSComment = '';

  public onClickEditBTS(event: Event) {
    this.updateBTSVisible = true;
  }

  public updateBTS(candidateId: string, BTSId: any, comment: string) {
    this.updateBTSLoading = true;
    instance
      .patch('/candidate/' + candidateId + '/bts', { BTSId, comment })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate BTS is updated');
          this.updateBTSVisible = false;
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.updateBTSLoading = false));
  }

  public updateBTSHandle(event: Event) {
    event.preventDefault();
    this.updateBTS(
      (this.candidate as any)._id,
      this.updateBTSId,
      this.updateBTSComment
    );
  }

  /**
   * UPDATE SCHEDULE
   */
  public updateScheduleVisible = false;
  public updateScheduleLoading = false;

  public updateScheduledTime = moment();
  public updateScheduleComment = '';

  public onClickEditSchedule(event: Event) {
    if ((this.candidate as any).scheduledTime) {
      this.updateScheduledTime = moment((this.candidate as any).scheduledTime);
    }
    this.updateScheduleVisible = true;
  }

  public updateSchedule(
    candidateId: string,
    scheduledTime: any,
    comment: string
  ) {
    this.updateScheduleLoading = true;
    scheduledTime = scheduledTime.unix() * 1000;
    instance
      .patch('/candidate/' + candidateId + '/schedule', {
        scheduledTime,
        comment
      })
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate schedule is updated');
          this.updateScheduleVisible = false;
          this.getCandidate();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.updateScheduleLoading = false));
  }

  public updateScheduleHandle(event: Event) {
    event.preventDefault();
    this.updateSchedule(
      (this.candidate as any)._id,
      this.updateScheduledTime,
      this.updateScheduleComment
    );
  }

  /**
   * DELETE CANDIDATE
   */
  public onClickDeleteCandidate() {
    this.onConfirmDeleteCandidate(this.candidate);
  }

  public deleteCandidate(candidate: any) {
    instance
      .delete('/candidate/' + candidate._id)
      .then(response => response.data)
      .then(response => {
        if (response.success) {
          this.$message.success('Candidate is deleted');
          this.$router.push({ path: '/' });
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      });
  }

  public onConfirmDeleteCandidate(candidate: any) {
    this.$confirm({
      parentContext: this,
      title: 'Do you REALLY want to DELETE this candidate?',
      content: 'Every stupid things will be paid',
      onOk: () => this.deleteCandidate(candidate),
      onCancel: async () => this.$message.info('Cancelling...')
    });
  }

  private mounted() {
    this.getCandidate();
  }
}
</script>
