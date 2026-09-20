import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Namespace Tests', () => {
    describe('isNotEmpty', () => {
        it('should return true for non-empty string', () => {
            expect(Validation.isNotEmpty('Clean Code')).to.be.true;
        });

        it('should return false for whitespace or empty string', () => {
            expect(Validation.isNotEmpty('')).to.be.false;
            expect(Validation.isNotEmpty('   ')).to.be.false;
        });
    });

    describe('isNumericId', () => {
        it('should return true for digits only', () => {
            expect(Validation.isNumericId('1725533394038')).to.be.true;
            expect(Validation.isNumericId('12345')).to.be.true;
        });

        it('should return false for letters or mixed characters', () => {
            expect(Validation.isNumericId('abc')).to.be.false;
            expect(Validation.isNumericId('123a45')).to.be.false;
            expect(Validation.isNumericId('')).to.be.false;
        });
    });

    describe('isValidYear', () => {
        it('should return true for valid past and current years', () => {
            expect(Validation.isValidYear(2004)).to.be.true;
            expect(Validation.isValidYear('1999')).to.be.true;
            expect(Validation.isValidYear('2024')).to.be.true;
        });

        it('should return false for non-4-digit numbers or future years', () => {
            expect(Validation.isValidYear('99')).to.be.false;
            expect(Validation.isValidYear('12345')).to.be.false;
            expect(Validation.isValidYear(3050)).to.be.false;
            expect(Validation.isValidYear('abcd')).to.be.false;
        });
    });

    describe('isValidEmail', () => {
        it('should return true for valid email formats', () => {
            expect(Validation.isValidEmail('test@gmail.com')).to.be.true;
        });

        it('should return false for invalid emails', () => {
            expect(Validation.isValidEmail('plainaddress')).to.be.false;
            expect(Validation.isValidEmail('@missinguser.com')).to.be.false;
        });
    });
});