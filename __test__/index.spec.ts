import { Promes } from '../src'
import {States} from "../src/types";

describe('The Promes constructor', () => {

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
