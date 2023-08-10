export enum CaptchaType {Image = 1, SmsMessage = 2}
export const captchaTypes = Object.keys(CaptchaType).filter(k => typeof CaptchaType[k] === 'number').map(t => ({label: t, value: CaptchaType[t]}));
export enum DingSysLevel {Other = 0, MainAdministrator = 1, SubAdministrator = 2, Boss = 100}
export const dingSysLevels = Object.keys(DingSysLevel).filter(k => typeof DingSysLevel[k] === 'number').map(t => ({label: t, value: DingSysLevel[t]}));
export enum ResponseCode {Success = 0, NotModified = 304, InvalidPayloadOrOperation = 400, Unauthenticated = 401, Unauthorized = 403, NotFound = 404, Conflict = 409, SystemError = 500, Timeout = 504, InvalidCaptcha = 100400}
export const responseCodes = Object.keys(ResponseCode).filter(k => typeof ResponseCode[k] === 'number').map(t => ({label: t, value: ResponseCode[t]}));
export enum Operation {DELETE = 0, INSERT = 1, EQUAL = 2}
export const operations = Object.keys(Operation).filter(k => typeof Operation[k] === 'number').map(t => ({label: t, value: Operation[t]}));
export enum ProgressorClientAction {Start = 1, Stop = 2, Initialize = 3}
export const progressorClientActions = Object.keys(ProgressorClientAction).filter(k => typeof ProgressorClientAction[k] === 'number').map(t => ({label: t, value: ProgressorClientAction[t]}));
export enum ProgressorEvent {StateChanged = 1, ProgressChanged = 2, ErrorOccurred = 3}
export const progressorEvents = Object.keys(ProgressorEvent).filter(k => typeof ProgressorEvent[k] === 'number').map(t => ({label: t, value: ProgressorEvent[t]}));
export enum ProgressorStatus {Idle = 1, Running = 2, Complete = 3, Suspended = 4}
export const progressorStatuses = Object.keys(ProgressorStatus).filter(k => typeof ProgressorStatus[k] === 'number').map(t => ({label: t, value: ProgressorStatus[t]}));
export enum FileStorageUploadResponseCode {Success = 0, Error = 500}
export const fileStorageUploadResponseCodes = Object.keys(FileStorageUploadResponseCode).filter(k => typeof FileStorageUploadResponseCode[k] === 'number').map(t => ({label: t, value: FileStorageUploadResponseCode[t]}));
export enum MessageStatus {ToBeSent = 0, Succeed = 1, Failed = 2}
export const messageStatuses = Object.keys(MessageStatus).filter(k => typeof MessageStatus[k] === 'number').map(t => ({label: t, value: MessageStatus[t]}));
export enum NotificationType {Os = 1, Email = 2, OsAndEmail = 3, WeChat = 4, Sms = 8}
export const notificationTypes = Object.keys(NotificationType).filter(k => typeof NotificationType[k] === 'number').map(t => ({label: t, value: NotificationType[t]}));
export enum AdbDeviceState {Device = 1, Offline = 2, NoDevice = 3}
export const adbDeviceStates = Object.keys(AdbDeviceState).filter(k => typeof AdbDeviceState[k] === 'number').map(t => ({label: t, value: AdbDeviceState[t]}));
export enum AdbExceptionCode {Error = 1, InvalidExitCode = 2}
export const adbExceptionCodes = Object.keys(AdbExceptionCode).filter(k => typeof AdbExceptionCode[k] === 'number').map(t => ({label: t, value: AdbExceptionCode[t]}));
export enum AdbInternalError {Error = 1, INSTALL_FAILED_ALREADY_EXISTS = 100, DELETE_FAILED_INTERNAL_ERROR = 101, FailedToConnectDevice = 200}
export const adbInternalErrors = Object.keys(AdbInternalError).filter(k => typeof AdbInternalError[k] === 'number').map(t => ({label: t, value: AdbInternalError[t]}));
export enum ListPropertyTag {Multiple = 1}
export const listPropertyTags = Object.keys(ListPropertyTag).filter(k => typeof ListPropertyTag[k] === 'number').map(t => ({label: t, value: ListPropertyTag[t]}));
export enum ListPropertyType {Number = 1, Input = 2, DateTime = 3, TimeSpan = 4, Select = 5, Date = 6, Text = 7, Image = 8, File = 9, External = 100, Computed = 200}
export const listPropertyTypes = Object.keys(ListPropertyType).filter(k => typeof ListPropertyType[k] === 'number').map(t => ({label: t, value: ListPropertyType[t]}));
export enum LogLevel {Trace = 0, Debug = 1, Information = 2, Warning = 3, Error = 4, Critical = 5, None = 6}
export const logLevels = Object.keys(LogLevel).filter(k => typeof LogLevel[k] === 'number').map(t => ({label: t, value: LogLevel[t]}));