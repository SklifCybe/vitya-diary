import { convertTimestampsToDate } from '.';

describe('convertTimestampsToDate', () => {
    it('should convert timestamps to Date objects', () => {
        const testData = {
            start: {
                seconds: 1705840675,
                nanoseconds: 173000000,
            },
            end: {
                seconds: 1705840675,
                nanoseconds: 173000000,
            },
        };

        const result = convertTimestampsToDate(testData);

        expect(result.start instanceof Date).toBe(true);
        expect(result.end instanceof Date).toBe(true);

        const expectedStartDate = new Date(1705840675 * 1000 + 173);
        const expectedEndDate = new Date(1705840675 * 1000 + 173);

        expect(result.start.getTime()).toBe(expectedStartDate.getTime());
        expect(result.end.getTime()).toBe(expectedEndDate.getTime());
    });

    it('should handle missing or invalid timestamps', () => {
        const testData = {
            // Missing start and end properties
            // start: {
            //   seconds: 1705840675,
            //   nanoseconds: 173000000,
            // },
            // end: {
            //   seconds: 1705840675,
            //   nanoseconds: 173000000,
            // },

            // Or use invalid values for nanoseconds
            start: {
                seconds: 1705840675,
                nanoseconds: 'invalid', // invalid nanoseconds value
            },
            end: {
                seconds: 1705840675,
                nanoseconds: 173000000,
            },
        };

        const result = convertTimestampsToDate(testData);

        expect(result.start instanceof Date).toBe(false);
        expect(result.end instanceof Date).toBe(false);
    });
});
