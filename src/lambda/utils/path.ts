export const getPathsSegments = (path: string, base: string) => {
  path = path.replace(`/.netlify/functions/${base}`, '');
  return path.split('/').filter(el => !!el);
};
