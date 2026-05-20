import { lightColors } from './palette';

export const Colors = {
  ...lightColors,
  statusPending: lightColors.warning,
  statusPendingBg: lightColors.warningLight,
  statusProcessing: lightColors.info,
  statusProcessingBg: lightColors.infoLight,
  statusCompleted: lightColors.success,
  statusCompletedBg: lightColors.successLight,
  statusCancelled: lightColors.error,
  statusCancelledBg: lightColors.errorLight,
} as const;
