export function errorHandler(err: unknown) {
  if (err instanceof Error) {
    console.error(`An error occurred: ${err.message}`);
  } else {
    console.error(`An unknown error occurred:`, err);
  }
}