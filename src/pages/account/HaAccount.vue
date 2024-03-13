<template>
  <q-page class="row column items-center q-pa-lg">
    <q-avatar
      size="100px"
      color="primary"
      text-color="white"
      class="justify-center items-center avatar"
      title="Редактировать"
      @click="handleAvatarClick"
    >
      <q-icon
        v-show="!blockAvatar"
        name="edit"
        class="avatar__edit-icon"
      />

      <img
        v-if="account.avatar"
        :src="account.avatar"
        :alt="`${account.firstName} ${account.lastName}`"
        class="avatar__img"
      >
    </q-avatar>

    <q-file
      v-model="avatar"
      ref="filePicker"
      type="file"
      style="display:none"
      max-file-size="2097152"
      accept="image/*"
      @update:model-value="handleUploadAvatar"
    />

    <h2>{{ account.firstName }} {{ account.lastName }}
      <q-btn
        flat
        icon="edit"
        size="md"
        color="primary"
        @click="handelClickEditName"
      />
    </h2>

    <p class="text-subtitle">{{ account.email }}</p>

    <p class="text-body1"><strong>Дата регистрации:</strong> {{ formatedCreatedAt }}</p>

    <div class="row q-gutter-md">
      <q-btn
        flat
        color="primary"
        @click="handleOpenChangePasswordDialog"
        :loading="loading"
      >Change password</q-btn>

      <q-btn
        color="primary"
        @click="handleLogout"
        :loading="loading"
      >Logout</q-btn>
    </div>
  </q-page>

  <ha-change-name-dialog
    v-model="showChangeNameDialog"
    v-bind="changeNameProps"
    @submit="handleSubmitName"
  />

  <ha-change-password-dialog
    v-model="showChangePasswordDialog"
    v-bind="changeNameProps"
  ></ha-change-password-dialog>
</template>

<script
  lang="ts"
  setup
>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs'

import HaChangeNameDialog from 'src/components/dialogs/HaChangeNameDialog.vue';
import HaChangePasswordDialog from 'src/components/dialogs/HaChangePasswordDialog.vue';

import { updateAccount } from 'src/supabase/account'
import { logout } from 'src/supabase/auth'
import { useAccount } from 'src/composables/account'
import { IAccount, IAccountName } from 'src/@types/supabase_account';

const router = useRouter()
const { getFullAccountData, uploadAvatar } = useAccount()

const account = reactive<IAccount>({
  avatar: null,
  firstName: '',
  lastName: '',
  email: '',
  createdAt: ''
})
const loading = ref<boolean>(false)
const avatar = ref<File | null>(null)
const filePicker = ref<HTMLElement | null>(null)
const blockAvatar = ref<boolean>(false)
const changeNameProps = reactive<IAccountName>({
  firstName: account.firstName,
  lastName: account.lastName
})
const showChangeNameDialog = ref<boolean>(false)
const showChangePasswordDialog = ref<boolean>(false)

const formatedCreatedAt = computed((): string => {
  return dayjs(account.createdAt).format('DD.MM.YYYY HH:mm')
})

const getAccountData = () => {
  getFullAccountData()
    .then((result) => {
      blockAvatar.value = false

      if (!result) return

      account.avatar = result.avatar
      account.firstName = result.firstName
      account.lastName = result.lastName
      account.email = result.email
      account.createdAt = result.createdAt
    })
}

const handleLogout = () => {
  loading.value = true

  logout()
    .then((error) => {
      if (!error) {
        router.push({ name: 'AccountLogin' })
      }

      loading.value = false
    })
}
const handleAvatarClick = () => {
  if (blockAvatar.value) return

  filePicker.value?.pickFiles()
}
const handleUploadAvatar = () => {
  if (!avatar.value) return
  blockAvatar.value = true

  uploadAvatar(avatar.value)
    .then((error) => {
      if (!error) {
        getAccountData()
      }
    })
}
const handelClickEditName = () => {
  showChangeNameDialog.value = true
}
const handleSubmitName = (data: IAccountName) => {
  console.log('-- handleSubmitName ---');

  updateAccount({
    first_name: data.firstName,
    last_name: data.lastName
  })
    .then(() => getAccountData())
}
const handleOpenChangePasswordDialog = () => {
  showChangePasswordDialog.value = true
}

getAccountData()
</script>

<style
  lang="scss"
  scoped
>
.avatar {
  position: relative;
  cursor: pointer;

  &:hover .avatar__edit-icon {
    opacity: 1;
    transition: opacity .15s;
  }
}

.avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__edit-icon {
  opacity: 0;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  transition: opacity .3s;
}

.account-name {
  width: 100%;
}

.account-name__form {
  width: 100%;
}
</style>
