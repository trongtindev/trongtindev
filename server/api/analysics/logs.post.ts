import type { IAuth } from '~~/server/interfaces/auth';
import dayjs from 'dayjs';

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as IAuth;
  const formData = await readFormData(event);

  const files = formData.getAll('files');
  if (!files || files.length == 0) throw createError({ status: 400 });

  const folder = dayjs().format('HH:mm_DD-MM-YY');

  const maxSize = 1024 * 1024 * 10;
  const result = await Promise.all(
    files
      .splice(0, 5)
      .filter((e, i) => {
        const size = e.toString().length;
        if (import.meta.dev) {
          console.log(i, { size, maxSize }, (size / maxSize) * 100);
        }
        return size <= maxSize;
      })
      .map((e, i) => {
        return uploadS3Object(
          e.toString(),
          `logs/${auth.userId}/${folder}/combined${i}.log`
        );
      })
  );
  return result.map((e) => e.ETag);
});
