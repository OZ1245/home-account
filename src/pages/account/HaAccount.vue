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

    <div class="account-name row justify-center">
      <h2 v-show="!editName">{{ account.firstName }} {{ account.lastName }}
        <q-btn
          flat
          icon="edit"
          size="md"
          color="primary"
          @click="handelClickEditName"
        />
      </h2>

      <q-form
        v-if="editName"
        class="account-name__form row justify-around q-pa-md"
        @submit="handleSubmitName"
      >
        <q-input
          v-model="formName.firstName"
          label="First Name"
          name="First Name"
        />
        <q-input
          v-model="formName.lastName"
          label="Last Name"
          name="Last Name"
        />
        <q-btn
          color="primary"
          icon="done"
          type="submit"
          size="md"
        />
      </q-form>
    </div>

    <p class="text-subtitle">{{ account.email }}</p>

    <p class="text-body1"><strong>Дата регистрации:</strong> {{ account.createdAt }}</p>

    <q-btn
      @click="handleLogout"
      :loading="loading"
    >Logout</q-btn>
  </q-page>
</template>

<script
  lang="ts"
  setup
>
import { updateAccount } from 'src/supabase/account'
import { logout } from 'src/supabase/auth'
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useFiles } from 'src/composables/account'

const router = useRouter()
const { getFullAccountData, uploadAvatar } = useFiles()

let account = reactive({
  avatar: null,
  firstName: '',
  lastName: '',
  email: '',
  createdAt: null
})
const loading = ref<boolean>(false)
const avatar = ref<File | null>(null)
const filePicker = ref<HTMLElement | null>(null)
const blockAvatar = ref<boolean>(false)
const editName = ref<boolean>(false)
const formName = reactive({
  firstName: account.firstName,
  lastName: account.lastName
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
  blockAvatar.value = true

  uploadAvatar(avatar.value)
    .then((error) => {
      if (!error) {
        getAccountData()
      }
    })
}

const handelClickEditName = () => {
  editName.value = true
}

const handleSubmitName = () => {
  console.log('-- handleSubmitName ---');

  updateAccount({
    first_name: formName.firstName,
    last_name: formName.lastName
  })
    .then(() => {
      getAccountData()

      editName.value = false
    })
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
