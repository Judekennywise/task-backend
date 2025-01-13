// create user
export interface IRegistrationBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar?: string;
}

// create token and activation code
export interface IActivationToken {
  token: string;
  activationCode: string;
}

// activate account
export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

// login user
export interface ILoginRequest {
  email: string;
  password: string;
}

// social login
export interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
  authProvider: string;
}

// update user info
export interface IUpdateUserInfo {
  email?: string;
  name?: string;
}

// update password
export interface IUpdatePassword {
  oldPassword?: string;
  newPassword?: string;
}

// update avatar
export interface IUpdatePicture {
  avatar: string;
}
