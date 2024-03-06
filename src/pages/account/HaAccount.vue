<template>
  <q-page class="row column items-center q-pa-lg">
    <q-avatar
      size="100px"
      color="primary"
      text-color="white"
      class="justify-center items-center"
      @mousemove="handleHoverAvatar"
      @mouseleave="handleLeaveAvatar"
      @click="handleAvatarClick"
    >
      <q-icon
        v-show="showAvatarEditIcon && !blockAvatar"
        name="edit"
      />

      <img
        v-if="account.avatar"
        :src="account.avatar"
        :alt="`${account.firstName} ${account.lastName}`"
        class="avatar"
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

    <h2>{{ account.firstName }} {{ account.lastName }}</h2>

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
import { fetchAccountData } from 'src/supabase/account'
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
const showAvatarEditIcon = ref<boolean>(false)
const loading = ref<boolean>(false)
const avatar = ref<File | null>(null)
const filePicker = ref<HTMLElement | null>(null)
const blockAvatar = ref<boolean>(false)

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

const handleHoverAvatar = () => {
  showAvatarEditIcon.value = true
}

const handleLeaveAvatar = () => {
  showAvatarEditIcon.value = false
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

getAccountData()
</script>

<style
  lang="scss"
  scoped
>
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>