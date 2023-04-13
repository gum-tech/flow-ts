import { AsyncOk, AsyncErr, Ok, Err, equals, AsyncResult } from '../src';

describe('AsyncResult', () => {
  describe('map', () => {
    it('should apply the function to the Ok value', async () => {
      const asyncResult = AsyncOk<number, string>(2);
      const mappedAsyncResult = asyncResult.map(value => value * 2);
      const result = await mappedAsyncResult;
      expect(equals(result, Ok(4))).toBe(true);
    });

    it('should not apply the function to the Err value', async () => {
      const asyncResult = AsyncErr<number, string>('error');
      const mappedAsyncResult = asyncResult.map(value => value * 2);
      const result = await mappedAsyncResult;
      expect(equals(result, Err('error'))).toBe(true);
    });
  });

  describe('mapErr', () => {
    it('should not apply the function to the Ok value', async () => {
      const asyncResult = AsyncOk<number, string>(2);
      const mappedAsyncResult = asyncResult.mapErr(error =>
        error.toUpperCase()
      );
      const result = await mappedAsyncResult;
      expect(equals(result, Ok(2))).toBe(true);
    });

    it('should apply the function to the Err value', async () => {
      const asyncResult = AsyncErr<number, string>('error');
      const mappedAsyncResult = asyncResult.mapErr(error =>
        error.toUpperCase()
      );
      const result = await mappedAsyncResult;
      expect(equals(result, Err('ERROR'))).toBe(true);
    });
  });

  describe('andThen', () => {
    it('should call the function with the Ok value and return a new AsyncResult', async () => {
      const asyncResult = AsyncOk<number, string>(2);
      const newAsyncResult = asyncResult.andThen(value =>
        value > 0 ? AsyncOk(value * 2) : AsyncErr('negative value')
      );
      const result = await newAsyncResult;
      expect(equals(result, Ok(4))).toBe(true);
    });

    it('should not call the function and return the Err value', async () => {
      const asyncResult = AsyncErr<number, string>('error');
      const newAsyncResult = asyncResult.andThen(value =>
        value > 0 ? AsyncOk(value * 2) : AsyncErr('negative value')
      );
      const result = await newAsyncResult;
      expect(equals(result, Err('error'))).toBe(true);
    });
  });
  describe('then', () => {
    it('should call the onfulfilled function with the Result value', async () => {
      const asyncResult = AsyncOk<number, string>(2);

      asyncResult.then(result => {
        expect(equals(result, Ok(2))).toBe(true);
      });
    });

    it('should call the onfulfilled function with an Err value when the Result is Err', async () => {
      const asyncResult = AsyncErr<string, string>('error');
      const onfulfilled = jest.fn();
      const onrejected = jest.fn();

      await asyncResult.then(onfulfilled, onrejected);

      expect(equals(onfulfilled.mock.calls[0][0], Err('error'))).toBe(true);
      expect(onrejected).not.toBeCalled();
    });

    it('should call the onrejected function when the promise is rejected', async () => {
      const asyncResult: AsyncResult<
        number,
        string
      > = new Promise((_, reject) =>
        reject(new Error('rejected'))
      ) as AsyncResult<number, string>;

      asyncResult.then(
        _ => {
          fail('onfulfilled should not be called');
        },
        error => {
          expect(error).toBeInstanceOf(Error);
        }
      );
    });
  });
});
