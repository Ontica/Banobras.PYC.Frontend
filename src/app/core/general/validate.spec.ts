/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Validate } from './validate';

const _ = Validate;

fdescribe('function hasValue()', () => {

  describe('should not have value', () => {

    it('null value should be false', () => {
      const value = null;
      expect(_.hasValue(value)).toBeFalse();
    });

    it('undefined value should be false', () => {
      const value = undefined;
      expect(_.hasValue(value)).toBeFalse();
    });

    it('NaN should be false', () => {
      const value = NaN;
      expect(_.hasValue(value)).toBeFalse();
    });

    it('empty object should be false', () => {
      const value = {};
      expect(_.hasValue(value)).toBeFalse();
    });

    it('empty string should be false', () => {
      const value = '';
      expect(_.hasValue(value)).toBeFalse();
    });
  });

  describe('should have value', () => {

    it('string value should be true', () => {
      const value = 'Hello world!';
      expect(_.hasValue(value)).toBeTrue();
    });

    it('object with value should be true', () => {
      const value = { value: 123 };
      expect(_.hasValue(value)).toBeTrue();
    });

    it('positive number should be true', () => {
      const value = 10;
      expect(_.hasValue(value)).toBeTrue();
    });

    it('negative number should be true', () => {
      const value = -10;
      expect(_.hasValue(value)).toBeTrue();
    });

    it('number with value equals to zero should be true', () => {
      const value = 0;
      expect(_.hasValue(value)).toBeTrue();
    });

    it('boolean with true value should be true', () => {
      const value = true;
      expect(_.hasValue(value)).toBeTrue();
    });

    it('boolean with false value should be true', () => {
      const value = false;
      expect(_.hasValue(value)).toBeTrue();
    });

    it('array with items should be true', () => {
      const value = [1, 2, 3];
      expect(_.hasValue(value)).toBeTrue();
    });

    it('empty array should be true', () => {
      const value = [];
      expect(_.hasValue(value)).toBeTrue();
    });

    it('file should be true', () => {
      const value = new File(["foo"], "foo.txt", { type: "text/plain" });
      expect(_.hasValue(value)).toBeTrue();
    });
  });

});
