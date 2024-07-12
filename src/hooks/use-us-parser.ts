import UAParser from 'ua-parser-js';

export const useUAParser = (userAgent: string) => {
  const parser = new UAParser();
  parser.setUA(userAgent);
  const result = parser.getResult();
  return result;
};
