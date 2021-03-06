import {Promes} from '../src'
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
      expect(p.state === States.REJECTED).toBeTruthy();
      expect(e.message).toBe('catch')
    })
  })

  it('should implement toString method', () => {
    const p = new Promes(r => r(4));
    expect(p.toString()).toBe('[object Promes]')
  })
});

describe('The Promes.resolve static method', () => {

  it('should implement Promes.resolve', () => {
    const val = Promes.hasOwnProperty('resolve')
    expect(val).toBeTruthy();
  })

  it('should work as expected', () => {
    const p = Promes.resolve(4)
    expect(p.then).toBeDefined();
    // console.log(p.state)  // should be pending?
    p.then(value =>  {
      expect(p.state === States.RESOLVED).toBeTruthy();
      expect(value).toBe(4)
    })
  })
});

describe('The Promes.reject static method', () => {
  it('should implement Promes.reject', () => {
    expect(Promes.hasOwnProperty('reject')).toBeTruthy();
  })

  it('should work properly', () => {
    const mock = jest.fn();
    const p = Promes.reject('5')
    p.then((val: any) => {
      mock()
    })
    p.catch(reason => {
      expect(reason).toBe('5')
    })
    expect(mock.mock.calls.length).toBe(0)
  })
})
