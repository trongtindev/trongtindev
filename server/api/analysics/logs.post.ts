import { IAuth } from '~~/server/interfaces/auth';
import dayjs from 'dayjs';

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as IAuth;
  const formData = await readFormData(event);

  const mainLog = formData.get('mainLog');
  const mainOldLog = formData.get('mainOldLog');
  if (!mainLog) throw createError({ status: 400 });

  const folder = dayjs().format('MM-HH_DD-MM-YY');

  await uploadS3Object(
    mainLog.toString(),
    `logs/${auth.userId}/${folder}/mainLog.log`
  );
  if (mainOldLog) {
    await uploadS3Object(
      mainOldLog.toString(),
      `logs/${auth.userId}/${folder}/mainOldLog.log`
    );
  }
});
