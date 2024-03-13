export interface IUploadAvatar {
  fileName: string
  file: File
}

export interface IAccountName {
  firstName?: string
  lastName?: string
}

export interface IAccount extends IAccountName {
  avatar?: string | null,
  email?: string,
  createdAt?: string
}

export interface IAccountPasswords {
  oldPassword: string,
  newPassword: string,
  newPasswordRepeat: string
}
