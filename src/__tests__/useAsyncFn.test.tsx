// NOTE: most behavior that useAsyncFn provides
//       is covered be the useAsync tests.
//
// The main difference is that useAsyncFn
// does not automatically invoke the function
// and it can take arguments.

import { cleanup, renderHook } from "react-hooks-testing-library";
import useAsyncFn, { AsyncState } from "../useAsyncFn";

afterEach(cleanup);

type AdderFn = (a: number, b: number) => Promise<number>;

describe("useAsyncFn", () => {
  it("should be defined", () => {
    expect(useAsyncFn).toBeDefined();
  });

  describe("args can be passed to the function", () => {
    let hook;
    let callCount = 0;
    const adder = async (a: number, b: number): Promise<number> => {
      callCount += 1;
      return a + b;
    };

    beforeEach(() => {
      // NOTE: renderHook isn't good at inferring array types
      hook = renderHook<{ fn: AdderFn }, [AsyncState<number>, AdderFn]>(
        ({ fn }) => useAsyncFn<number>(fn),
        {
          initialProps: {
            fn: adder
          }
        }
      );
    });

    // it("initially does not have a value", () => {
    //   const [state, _callback] = hook.result.current;

    //   expect(state.value).toEqual(undefined);
    //   expect(state.loading).toEqual(false);
    //   expect(state.error).toEqual(undefined);
    //   expect(callCount).toEqual(0);
    // });

    describe("when invoked", () => {
      it("resolves a value derived from args", async () => {
        expect.assertions(4);

        const [_s, callback] = hook.result.current;

        callback(2, 7);
        hook.rerender({ fn: adder });
        await hook.waitForNextUpdate();

        const [state, _c] = hook.result.current;

        expect(callCount).toEqual(1);
        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(undefined);
        expect(state.value).toEqual(9);
      });
    });
  });
});
