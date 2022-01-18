/* eslint-disable @typescript-eslint/no-explicit-any */
export const circularReplacer = (): any => {
    const seen = new WeakSet();
    return (key: string | number, value: any): any => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};
