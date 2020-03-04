<template>
  <div>
    <a-card title="Candidates">
      <a-button slot="extra" type="primary" @click="showNewCandidateModal">
        <a-icon type="plus-square" />New candidate
      </a-button>

      <a-table
        :columns="candidateColumns"
        :dataSource="candidateList"
        rowKey="_id"
      >
        <div
          slot="filterDropdown"
          slot-scope="{
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            column
          }"
          style="padding: 8px"
        >
          <a-input
            v-ant-ref="c => (searchInput = c)"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            @change="
              e => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm)"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            >Search</a-button
          >
          <a-button
            @click="() => handleReset(clearFilters)"
            size="small"
            style="width: 90px"
            >Reset</a-button
          >
        </div>

        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />

        <template slot="nameCustomRender" slot-scope="name">
          <span v-if="searchText">
            <template
              v-for="(fragment, i) in name
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                :key="i"
                class="highlight"
                >{{ fragment }}</mark
              >
              <template v-else>{{ fragment }}</template>
            </template>
          </span>
          <template v-else>{{ name }}</template>
        </template>

        <!-- CANDIDATE PROCESS -->
        <template slot="process" slot-scope="process">
          <a-tag v-if="process" :color="process.color">{{
            process.name
          }}</a-tag>
          <a-tag v-else>Unprovided</a-tag>
        </template>

        <!-- CANDIDATE STATUS -->
        <template slot="status" slot-scope="status">
          <a-tag v-if="status" :color="status.color">{{ status.name }}</a-tag>
          <a-tag v-else>Unprovided</a-tag>
        </template>

        <!-- CANDIDATE EMAIL -->
        <template slot="email" slot-scope="email">
          <a :href="'mailto:' + email">{{ email }}</a>
        </template>

        <!-- CANDIDATE ADDED AT -->
        <template slot="createdAt" slot-scope="createdAt">
          {{ dayjs(createdAt).fromNow() }}
        </template>

        <!-- EXTENDED -->
        <template slot="more" slot-scope="id">
          <router-link :to="'/candidate/' + id">
            <a-button size="small" :ghost="true" type="primary"
              ><a-icon type="profile" />Details</a-button
            >
          </router-link>
        </template>
      </a-table>
    </a-card>

    <a-modal
      style="top: 70px;"
      title="Add new candidate"
      :footer="null"
      :visible="newCandidateModalVisible"
      :maskClosable="false"
      :confirmLoading="isNewCandidateCreating"
      @cancel="cancelNewCandidateModal"
    >
      <a-form @submit="addNewCandidateHandle">
        <a-form-item label="Full name">
          <a-input
            v-model="newCandidate.name"
            placeholder="Full name of new candidate"
          ></a-input>
        </a-form-item>
        <a-form-item label="Email">
          <a-input
            type="email"
            v-model="newCandidate.email"
            placeholder="Email of new candidate"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            style="float:right;"
            :disabled="newCandidate.name === '' && newCandidate.email === ''"
            type="primary"
            html-type="submit"
          >
            <a-icon type="plus-square" />Add this user
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import instance from '@/instance';
import { Component, Vue } from 'vue-property-decorator';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

@Component
export default class Main extends Vue {
  public dayjs = dayjs;

  /**
   * Add new candidate section
   */
  public newCandidate = {
    name: '',
    email: '',
    reset: function() {
      this.name = '';
      this.email = '';
    }
  };
  public newCandidateModalVisible = false;
  public isNewCandidateCreating = false;
  public showNewCandidateModal() {
    this.newCandidateModalVisible = true;
  }
  public cancelNewCandidateModal() {
    this.newCandidateModalVisible = false;
  }

  public addNewCandidate(name: string, email: string) {
    this.isNewCandidateCreating = true;
    instance
      .post('/candidate/new', { name, email })
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.$message.success('New candidate is created');
          this.candidateList.unshift(response.data as never);
          this.cancelNewCandidateModal();
          this.newCandidate.reset();
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isNewCandidateCreating = false));
  }

  public addNewCandidateHandle(event: Event) {
    event.preventDefault();
    this.addNewCandidate(this.newCandidate.name, this.newCandidate.email);
  }

  /**
   * Table filter section
   */
  public searchText = '';
  public searchInput = null;

  public handleSearch(selectedKeys: any, confirm: any) {
    confirm();
    this.searchText = selectedKeys[0];
  }

  public handleReset(clearFilters: any) {
    clearFilters();
    this.searchText = '';
  }

  /**
   * Get candidates list section
   */
  public candidateList = [];
  public candidateColumns = [
    {
      title: 'Process',
      dataIndex: 'process',
      key: 'process',
      scopedSlots: {
        customRender: 'process'
      },
      width: '10%',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      scopedSlots: {
        customRender: 'status'
      },
      width: '10%',
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: {
        filterDropdown: 'filterDropdown',
        filterIcon: 'filterIcon',
        customRender: 'nameCustomRender'
      },
      onFilter: (value: any, record: any) =>
        record.name
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      scopedSlots: {
        customRender: 'email'
      }
    },
    {
      title: 'Added at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      scopedSlots: {
        customRender: 'createdAt'
      },
      width: '15%'
    },
    {
      title: '',
      dataIndex: '_id',
      key: '_id',
      scopedSlots: {
        customRender: 'more'
      },
      align: 'center'
    }
  ];
  public isCandidateLoading = false;
  public async getListCandidate() {
    this.isCandidateLoading = true;
    instance
      .get('/candidates')
      .then(response => response.data)
      .then(response => {
        if (response.data) {
          this.candidateList = response.data;
        } else {
          this.$message.error(response.error || response);
        }
      })
      .catch(errors => {
        console.log(errors);
        this.$message.error('Something went wrong #.#');
      })
      .finally(() => (this.isCandidateLoading = false));
  }

  private mounted() {
    this.getListCandidate();
  }
}
</script>
