import {Handler, Inspection, rejectHandler, resolveHandler, States, Thenable} from "./types";

const isFunction = (func: Function) => typeof func === 'function';

const isObject = (obj: Object) => Object.prototype.toString.call(obj).slice(8, -1) === 'Object';

const isThenable = (obj: any) => isObject(obj) && isFunction(obj.then);

class Promes<T> implements Thenable<T>, Inspection<T>{
  private _state: States = States.PENDING;
  private value: T | any;
  private reason: any;
  private handlers: Handler<T, any>[] = [];

  constructor(resolver: (
    resolve: (value: T | Thenable<T>) => void,
    reject: (reason: any) => void
    ) => void
  ){
    if (typeof resolver !== 'function') {
      throw new TypeError('resolver must be a function')
    }
    try {
      resolver(this._resolve, this._reject)
    } catch (e) {
      this._reject(e)
    }
  }

  public get state() {
    return this._state
  }

  public then = <T>(
    onfulfilled?: resolveHandler<T, any>,
    onrejected?: rejectHandler<any>
  ) => {
    return new Promes<T>(((resolve, reject) => {
      return this.attachHandlers({
        onfulfilled: (result) => {
          if (!onfulfilled) {
            return resolve(result);
          }
          try {
            return resolve(onfulfilled(result))
          } catch (e) {
            return reject(e)
          }
        },
        onrejected: (result) => {
          if (!onrejected) {
            return reject(result)
          }
          try {
            return resolve(onrejected(result))
          } catch (e) {
            return reject(e)
          }
        }
      })
    }))
  };

  // catch was just a thenable without onfulfilled handler.
  public catch<R>(onrejected: rejectHandler<R>) {
    return this.then(null, onrejected)
  }

  public static resolve<T>(value: T | Thenable<T>) {
    return new Promes((resolve) => {
      return resolve(value)
    })
  }

  public static reject<T>(reason: T | Thenable<T>) {
    return new Promes((_, reject) => {
      return reject(reason)
    })
  }

  public toString() {
    return '[object Promes]'
  }

  private executeHandlers = () => {
    if (this.state === States.PENDING) {
      return null;
    }
    this.handlers.forEach((handler: Handler<T, any>) => {
      if (this.state === States.REJECTED) {
        this.reason = this.value;
        return handler.onrejected!(this.value)
      }
      return handler.onfulfilled!(this.value)
    });
    this.handlers = []
  };

  private attachHandlers = (handler: any) => {
    this.handlers = [...this.handlers, handler];
    this.executeHandlers()
  };

  private setResult = (value: T | any, state: States) => {
    const set = () => {
      if (this.state !== States.PENDING) {
        return null;
      }
      if (isThenable(value)) {
        return (value as Thenable<T>).then(this._resolve, this._reject)
      }
      this.value = value;
      this._state = state;
      this.executeHandlers()
    };
    setTimeout(set, 0)
  };

  private _resolve = (value: T | Thenable<T>) => {
    // this.state = States.RESOLVED;
    // this.value = value;
    // return value;
    return this.setResult(value, States.RESOLVED)
  };

  private _reject = <T>(reason: any | T) => {
    this.setResult(reason, States.REJECTED)
  };

}

export { Promes }
