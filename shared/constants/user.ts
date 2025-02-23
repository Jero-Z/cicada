export const REMARK_MAX_LENGTH = 64;
export const NICKNAME_MAX_LENGTH = 32;

export enum AllowUpdateKey {
  AVATAR = 'avatar',
  NICKNAME = 'nickname',
  MUSICBILL_ORDERS = 'musicbill_orders',
}

export enum AdminAllowUpdateKey {
  EMAIL = 'email',
  REMARK = 'remark',
  ADMIN = 'admin',
  MUSICBILL_MAX_AMOUNT = 'musicbillMaxAmount',
  CREATE_MUSIC_MAX_AMOUNT_PER_DAY = 'createMusicMaxAmountPerDay',
  EXPORT_MUSICBILL_MAX_TIME_PER_DAY = 'exportMusicbillMaxTimePerDay',
}
