import { Promes } from '../src'
import {States} from "../src/types";

describe('The Promes constructor', () => {

  it('should be a function', () => {
    expect(typeof Promes === 'function').toBeTruthy()
  })

  it('should throw if resolver is not a function', () => {
    expect(() => new Promes({})).toThrowError(new TypeError('resolver must be a function')
    )
  });

  it('should always transition to correct type', () => {
    const p = new Promes<number>((resolve: any) => {
      resolve(5)
    });
    expect(p.state === 'pending').toBeTruthy()
  });

  it('should define correct resolve and reject function with one parameter', () => {
    let resolve: Function
    let reject: Function
    const p = new Promes((rs, rj) => {
      resolve = rs
      reject = rj
    })
    expect(Object.getOwnPropertyDescriptor(resolve, 'length').value).toBe(1)
    expect(Object.getOwnPropertyDescriptor(reject!, 'length').value).toBe(1)
  });

  it('should run asynchronous like Promise', () => {
    const p = new Promes(((resolve) => {
      resolve(5)
    }))
    p.then(value => {
      expect(value).toBe(5);
      expect(p.state).toBe(States.RESOLVED)
    })
  })

  it('should catch', () => {
    const p = new Promes(((_, reject) => {
      reject(new Error('catch'))
    }))
    p.catch((e: Error) => {
      expect(e.message).toBe('catch')
    })
  })
});
