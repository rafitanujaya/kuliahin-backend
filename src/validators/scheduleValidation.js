import Joi from "joi"

const createScheduleSchema = Joi.object({
    day: Joi.string().valid('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu').required(),
    location: Joi.string().min(1).max(255).required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
}).required().custom((value, helpers) => {
  const [sh, sm] = value.startTime.split(':').map(Number);
  const [eh, em] = value.endTime.split(':').map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  if (startMinutes >= endMinutes) {
    return helpers.error('time.invalidRange');
  }

  return value;
})
.messages({
  'time.invalidRange': 'endTime harus lebih besar dari startTime'
});

const updateScheduleSchema = Joi.object({
    day: Joi.string().valid('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu').required(),
    location: Joi.string().min(1).max(255).required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
}).required().custom((value, helpers) => {
  const [sh, sm] = value.startTime.split(':').map(Number);
  const [eh, em] = value.endTime.split(':').map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  if (startMinutes >= endMinutes) {
    return helpers.error('time.invalidRange');
  }

  return value;
})
.messages({
  'time.invalidRange': 'endTime harus lebih besar dari startTime'
});

export {
    createScheduleSchema,
    updateScheduleSchema
}