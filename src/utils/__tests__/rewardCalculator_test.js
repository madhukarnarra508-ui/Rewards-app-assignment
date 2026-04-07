import { calculateRewards } from "../rewardCalculator";

describe('calculateRewards',()=>{
    test('returns o for amounts <= 50', () =>{
        expect(calculateRewards(50)).toBe(0);
    });
    
    test('calculates points between 50 and 100',()=>{
        expect(calculateRewards(75)).toBe(25);
    });

    test('handles decimal amounts correctly', ()=>{
    expect(calculateRewards(100.4)).toBe(50);
    });
    
    test('calculates points above 100 correctly', ()=>{
        expect(calculateRewards(120)).toBe(90);
    });

    test('returns error for invalid input', ()=>{
        expect(() => calculateRewards(NaN)).toThrow('Invalid amount passed to reward calculator');
    });
})