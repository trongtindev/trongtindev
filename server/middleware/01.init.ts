export default defineEventHandler((event) => {
  process.env.TZ = useRuntimeConfig().TZ;
});
