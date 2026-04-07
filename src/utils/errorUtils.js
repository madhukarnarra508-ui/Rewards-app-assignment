//Creates a standardized error object

export function createError({ message, source, details = null }) {
  return {
    hasError: true,
    message,
    source,
    details,
  };
}

export const NO_ERROR = {
  hasError: false,
  message: "",
  source: "",
  details: null,
};
