import { computeSeries } from "./series";

describe("computeSeries", () => {
  it("takes in params and returns a series", () => {
    const params = {
      label: "foo",
      formula: (value) => value + 1,
      startValue: 0,
      startTimeEpochSeconds: 0,
      numberOfSteps: 3,
      timeDeltaEpochSeconds: 5,
    };
    const result = computeSeries(params);

    expect(result).toEqual({
      label: params.label,
      data: [
        { value: 0, timeStampEpochSeconds: 0 },
        { value: 1, timeStampEpochSeconds: 5 },
        { value: 2, timeStampEpochSeconds: 10 },
        { value: 3, timeStampEpochSeconds: 15 },
      ],
    });
  });
});
