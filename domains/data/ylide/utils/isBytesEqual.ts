export const isBytesEqual = (a: Uint8Array, b: Uint8Array) => {
	return a.length === b.length && a.every((v, i) => v === b[i]);
};
