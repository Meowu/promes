import {Promes} from "../src";

describe('The Promes finally method', () => {
    it('should define finally method', () => {
        const p = Promes.resolve(3)
        expect(Promes.prototype.finally instanceof Function).toBeTruthy();
        expect(typeof p.finally === 'function').toBeTruthy();
    })

    it('should passed a function', () => {
        const p = Promes.resolve(3);
        p.finally(function () {
            expect(arguments.length).toBe(0);
        })
    })
})
