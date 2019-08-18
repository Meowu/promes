
export const enum States {
  PENDING='pending',
  RESOLVED='resolved',
  REJECTED='rejected'
}

export type resolveHandler<T, R> = ((value: T) => R | Thenable<R>) | undefined | null

export type rejectHandler<R> = ((reason?: any) => R | Thenable<R>) | undefined | null

export interface Thenable<T> {
  then<T1=T, T2=any>(
    onfulfilled?: resolveHandler<T1, T2>,
    onrejected?: rejectHandler<T2>
  ): Thenable<T1 | T2>
}

export interface Handler<T, R> {
  onfulfilled: resolveHandler<T, R>,
  onrejected: rejectHandler<R>
}

export interface Inspection<T> {
  state: States,
  value: T,
  reason: any
}
